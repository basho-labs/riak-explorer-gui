import DS from 'ember-data';

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
var RiakObject = DS.Model.extend({
  /**
   * Riak Bucket in which this object lives.
   * @property bucket
   * @type Bucket
   * @writeOnce
   */
  bucket: DS.belongsTo('bucket', {async: true}),

  /**
   * Riak object headers/metadata.
   * @property metadata
   * @type ObjectMetadata
   */
  //metadata: DS.belongsTo('object-metadata'),

  /**
   * The value/contents of the object.
   * @property contents
   * @type Object
   */
  //contents: DS.attr(),

  /**
   * Has the object been fully loaded from the server?
   * @property isLoaded
   * @type Boolean
   * @default false
   */
  //isLoaded: DS.attr('boolean', {defaultValue: false}),

  /**
   * The object's primary key.
   * @property key
   * @type String
   * @writeOnce
   */
  name: DS.attr('string')

  /**
   * Was this object marked as deleted by Explorer UI?
   * Note: Deleted objects may still show up in the API-side key list cache.
   * @property markedDeleted
   * @type Boolean
   * @default false
   */
  //markedDeleted: DS.attr('boolean', {defaultValue: false}),

  /**
   * The URL to fetch the raw contents of the object directly from server.
   * Used with the 'View Raw' button.
   * @property rawUrl
   * @type String
   * @writeOnce
   */
  //rawUrl: DS.attr('string')

  /**
   * Can this object type be edited directly, in a text box?
   * @property canBeEdited
   * @readOnly
   * @default true
   * @type {Boolean}
   */
  //canBeEdited: function() {
  //  return true;
  //}.property(),

  /**
   * Can this object be viewed/downloaded directly from the browser?
   * @property canBeViewedRaw
   * @readOnly
   * @default true
   * @type {Boolean}
   */
  //canBeViewedRaw: function() {
  //  return true;
  //}.property(),

  /**
   * Returns a browser-displayable representation of the object value,
   *     if possible (based on the object's `contentType`).
   * @method contentsForDisplay
   * @return {String|Null}
   */
  //contentsForDisplay: function() {
  //  let contentType = this.get('metadata').get('contentType');
  //  let displayContents;
  //  // Determine whether this is browser-displayable contents
  //  if (contentType.startsWith('plain/text') ||
  //    contentType.startsWith('application/json') ||
  //    contentType.startsWith('application/xml') ||
  //    contentType.startsWith('multipart/mixed')) {
  //    displayContents = this.get('contents');
  //  } else {
  //    displayContents = null;
  //  }
  //  return displayContents;
  //}.property('contents', 'metadata'),

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
