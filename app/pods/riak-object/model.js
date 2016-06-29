import DS from 'ember-data';
import ObjectHeaders from '../../mixins/models/object-headers';
import MapObject from '../../mixins/models/map-object';

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
export default DS.Model.extend(ObjectHeaders, MapObject, {
  /**
   * Riak Bucket in which this object lives.
   * @property bucket
   * @type Bucket
   * @writeOnce
   */
  bucket: DS.belongsTo('bucket'),

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

  type: DS.attr('string'),

  /**
   * The URL to fetch the raw contents of the object directly from server.
   * Used with the 'View Raw' button.
   * @property rawUrl
   * @type String
   * @writeOnce
   */
  url: DS.attr('string'),

  bucketType: function() {
    try {
      return this.get('bucket').get('bucketType');
    } catch(e) { return undefined; }
  }.property('bucket'),

  cluster: function() {
    try {
      return this.get('bucket').get('bucketType').get('cluster');
    } catch(e) { return undefined; }
  }.property('bucket'),

  /**
   * Boolean check to see if the contents should be shown through the UI.
   *
   * @method showContents
   * @return {Boolean}
   */
  showContents: function() {
    let contentType = this.get('contentType');

    if (contentType) {
      return (contentType.startsWith('plain/text') ||
      contentType.startsWith('application/json') ||
      contentType.startsWith('application/javascript') ||
      contentType.startsWith('application/xml') ||
      contentType.startsWith('multipart/mixed'));
    } else {
      return false;
    }
  }.property('contentType'),

  contentTypeLanguage: function() {
    let contentType = this.get('contentType');
    let language = null;

    if (contentType) {
      switch (contentType) {
        case 'application/json':
        case 'application/javascript':
          language = 'javascript';
          break;
        case 'application/xml':
          language = 'xml';
          break;
        default:
          language = 'javascript';
          break;
      }
    }

    return language;
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
  }.property('bucket')
});
