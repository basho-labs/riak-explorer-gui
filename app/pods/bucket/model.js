import DS from 'ember-data';

/**
 * Represents a Riak Bucket
 *
 * @class Bucket
 * @extends DS.Model
 * @constructor
 * @uses BucketType
 * @uses Cluster
 * @uses BucketProps
 * @uses KeyList
 */
var Bucket = DS.Model.extend({
     /**
      * Riak cluster in which this bucket lives.
      * @property cluster
      * @type Cluster
      * @writeOnce
      */
    cluster: DS.belongsTo('cluster'),

    /**
     * Riak Bucket Type in which this bucket lives.
     * @property bucketType
     * @type BucketType
     * @writeOnce
     */
    bucketType: DS.belongsTo('bucket-type'),

    /**
     * Has the keyList been loaded from the server?
     * @property isKeyListLoaded
     * @type Boolean
     * @default false
     */
    isKeyListLoaded: DS.attr('boolean', { defaultValue: false }),

    /**
     * Contains the results of cached key lists for this bucket,
     * fetched from the API.
     * @property key-list
     * @type KeyList
     */
    keyList: DS.belongsTo('key-list'),

    /**
     * Bucket name (unique within a cluster and bucket type)
     * @property name
     * @type String
     */
    name: DS.attr('string'),

    /**
     * Bucket Properties object. Note: Bucket Types and Buckets share the
     *    same Properties format.
     * When not specified, buckets inherit their properties from the Bucket Type
     * @property props
     * @type BucketProps
     */
    props: DS.belongsTo('bucket-props'),

    /**
     * Returns the bucket name (this is an alias/helper function)
     * @property bucketId
     * @type String
     */
    bucketId: function() {
        return this.get('name');
    }.property('name'),

    /**
     * Returns the bucket type's name
     * @property bucketTypeId
     * @type String
     */
    bucketTypeId: function() {
        return this.get('bucketType').get('bucketTypeId');
    }.property('cluster'),

    /**
     * Returns the name of the cluster in which this bucket resides.
     * (As specified in the `riak_explorer.conf` file)
     * @property clusterId
     * @type String
     */
    clusterId: function() {
        return this.get('cluster').get('clusterId');
    }.property('cluster'),

    /**
     * Has this bucket type been activated?
     * @property isActive
     * @type Boolean
     */
    isActive: function() {
        return this.get('props').get('isActive');
    }.property('props'),

    /**
     * Returns the name of the Search Index associated with this bucket
     * (or its parent bucket type), if applicable.
     * @property index
     * @type String
     */
    index: function() {
        return this.get('cluster').get('indexes')
            .findBy('name', this.get('props').get('searchIndexName'));
    }.property('cluster'),

    /**
     * Returns the Ember.js/Ember Data model name of the objects stored within
     *     this bucket.
     * @property objectModelName
     * @type String}
     * @default 'riak-object'
     */
    objectModelName: function() {
        if(this.get('props').get('isCounter')) {
            return 'riak-object.counter';
        }
        if(this.get('props').get('isSet')) {
            return 'riak-object.set';
        }
        if(this.get('props').get('isMap')) {
            return 'riak-object.map';
        }
        return 'riak-object';
    }.property('props'),

    /**
     * Returns this bucket's properties as an array of key/value tuples.
     * Used for displaying and editing the properties.
     * @method propsList
     * @return {Array<Hash>}
     */
    propsList: function() {
        if(!this.get('props')) {
            return [];
        }
        return this.get('props').get('propsList');
    }.property('props')
});

export default Bucket;
