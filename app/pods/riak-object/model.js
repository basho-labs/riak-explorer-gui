import DS from 'ember-data';
import ObjectHeaders from '../../mixins/models/object-headers';

/**
 * Represents a plain (non Data Type) Riak Object.
 *
 * @class RiakObject
 * @extends DS.Model
 * @constructor
 * @uses Bucket
 * @uses BucketType
 * @uses Cluster
 * @uses ObjectMetadata
 * @param [key] {String}
 * @param [bucket] {Bucket}
 * @param [bucketType] {BucketType}
 * @param [cluster] {Cluster}
 * @param [metadata] {ObjectMetadata}
 * @param [isLoaded] {Boolean} Has this been loaded from server. Default: `false`
 * @param [rawUrl] {String}
 * @param [contents] {Object} Object value/payload
 */
var RiakObject = DS.Model.extend(ObjectHeaders, {
  /**
   * Riak Bucket in which this object lives.
   * @property bucket
   * @type Bucket
   * @writeOnce
   */
  bucket: DS.belongsTo('bucket', {async: true}),

  /**
   * The value/contents of the object.
   * @property contents
   * @type Object
   */
  contents: DS.attr(),

  /**
   * The object's primary key.
   * @property name
   * @type String
   */
  name: DS.attr('string'),

  /**
   * The URL to fetch the raw contents of the object directly from server.
   * Used with the 'View Raw' button.
   * @property rawUrl
   * @type String
   * @writeOnce
   */
  url: DS.attr('string'),

  bucketType: function() {
    return this.get('bucket').get('bucketType');
  }.property('bucket'),

  cluster: function() {
    return this.get('bucket').get('bucketType').get('cluster');
  }.property('bucket'),

  /**
   * Boolean check to see if the contents should be shown through the UI.
   *
   * @method showContents
   * @return {Boolean}
   */
  showContents: function() {
    let contentType = this.get('contentType');

    return (contentType.startsWith('plain/text') ||
    contentType.startsWith('application/json') ||
    contentType.startsWith('application/xml') ||
    contentType.startsWith('multipart/mixed'));
  }.property('contentType'),

  routePath: function() {
    let bucket = this.get('bucket');
    let routePath = null;

    switch (true) {
      case bucket.get('isCounter'):
        routePath = 'riak-object.counter';
        break;
      case bucket.get('isSet'):
        routePath = 'riak-object.set';
        break;
      case bucket.get('isMap'):
        routePath = 'riak-object.map';
        break;
      default:
        routePath = 'riak-object';
        break;
    }

    return routePath;
  }.property('bucket'),

  addAdditionalCRDTBehavior: function() {
    //if (this.get('bucket').get('isSet')) {
    //  debugger;
    //  //Foo.apply(this);
    //}
  }.property('bucket')


  /**
   * Has the object been fully loaded from the server?
   * @property isLoaded
   * @type Boolean
   * @default false
   */
  //isLoaded: DS.attr('boolean', {defaultValue: false}),

  /**
   * Was this object marked as deleted by Explorer UI?
   * Note: Deleted objects may still show up in the API-side key list cache.
   * @property markedDeleted
   * @type Boolean
   * @default false
   */
  //markedDeleted: DS.attr('boolean', {defaultValue: false}),

  /**
   * Returns true if the object has been deleted either on the server
   *    or via the Explorer app.
   * @method isDeleted
   * @return {Boolean}
   */
  //isDeleted: function() {
  //  var deletedOnRiak = false;
  //  if (this.get('metadata')) {
  //    deletedOnRiak = this.get('metadata').get('isDeleted');
  //  }
  //  return this.get('markedDeleted') || deletedOnRiak;
  //}.property('markedDeleted', 'metadata')
});

export default RiakObject;
