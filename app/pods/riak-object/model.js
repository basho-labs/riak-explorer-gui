import DS from 'ember-data';

/**
 * Represents a Riak Object.
 * @class RiakObject
 * @extends DS.Model
 * @constructor
 * @uses Bucket
 * @uses BucketType
 * @uses Cluster
 * @uses ObjectMetadata
 */
var RiakObject = DS.Model.extend({
    /**
     * Riak Bucket in which this object lives.
     * @property bucket
     * @type Bucket
     * @writeOnce
     */
    bucket: DS.belongsTo('bucket'),

    /**
     * Riak Bucket Type in which this object lives.
     * @property bucketType
     * @type BucketType
     * @writeOnce
     */
    bucketType: DS.belongsTo('bucket-type'),

    /**
     * Riak cluster in which this object lives.
     * @property cluster
     * @type Cluster
     * @writeOnce
     */
    cluster: DS.belongsTo('cluster'),

    /**
     * The value/contents of the object.
     * @property contents
     * @type Object
     */
    contents: DS.attr(),

    /**
     * Has the object been fully loaded from the server?
     * @property isLoaded
     * @type Boolean
     * @default false
     */
    isLoaded: DS.attr('boolean', {defaultValue: false}),

    /**
     * The object's primary key.
     * @property key
     * @type String
     * @writeOnce
     */
    key: DS.attr('string'),

    // This object was marked as deleted by Explorer UI,
    //  but may show up in key list cache.
    markedDeleted: DS.attr('boolean', {defaultValue: false}),

    /**
     * Riak object headers/metadata.
     * @property metadata
     * @type ObjectMetadata
     */
    metadata: DS.belongsTo('object-metadata'),

    /**
     * The URL to fetch the raw contents of the object directly from server.
     * Used with the 'View Raw' button.
     * @property rawUrl
     * @type String
     * @writeOnce
     */
    rawUrl: DS.attr('string'),

    /**
     * @property bucketId
     * @type String
     */
    bucketId: function() {
        return this.get('bucket').get('bucketId');
    }.property('bucket'),

    /**
     * @property bucketTypeId
     * @type String
     */
    bucketTypeId: function() {
        return this.get('bucketType').get('bucketTypeId');
    }.property('bucket'),

    /**
     * Can this object type be edited directly, in a text box?
     * @property canBeEdited
     * @readOnly
     * @default true
     * @type {Boolean}
     */
    canBeEdited: function() {
        return true;
    }.property(),

    /**
     * Can this object be viewed/downloaded directly from the browser?
     * @property canBeViewedRaw
     * @readOnly
     * @default true
     * @type {Boolean}
     */
    canBeViewedRaw: function() {
        return true;
    }.property(),

    /**
     * @property clusterId
     * @type String
     */
    clusterId: function() {
        return this.get('cluster').get('clusterId');
    }.property('bucket'),

    /**
     * Returns a browser-displayable representation of the object value,
     *     if possible (based on the object's `contentType`).
     * @method contentsForDisplay
     * @return {String|Null}
     */
    contentsForDisplay: function() {
        var contentType = this.get('metadata').get('contentType');
        var displayContents;
        // Determine whether this is browser-displayable contents
        if(contentType.startsWith('text') ||
                contentType.startsWith('application/json') ||
                contentType.startsWith('application/xml') ||
                contentType.startsWith('multipart/mixed') ) {
            displayContents = this.get('contents');
        } else {
            displayContents = null;
        }
        return displayContents;
    }.property('contents', 'metadata'),

    /**
     * Returns true if the object has been deleted either on the server
     *    or via the Explorer app.
     * @method isDeleted
     * @return {Boolean}
     */
    isDeleted: function() {
        var deletedOnRiak = false;
        if(this.get('metadata')) {
            deletedOnRiak = this.get('metadata').get('isDeleted');
        }
        return this.get('markedDeleted') || deletedOnRiak;
    }.property('markedDeleted', 'metadata')
});

export default RiakObject;
