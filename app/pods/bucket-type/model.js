import DS from 'ember-data';

/**
 * Represents a Riak Bucket Type
 *
 * @class BucketType
 * @extends DS.Model
 * @constructor
 * @uses Cluster
 * @uses BucketProps
 * @uses BucketList
 */
var BucketType = DS.Model.extend({
    /**
     * Riak cluster in which this bucket type lives.
     * @property cluster
     * @type Cluster
     * @writeOnce
     */
    cluster: DS.belongsTo('cluster'),

    /**
     * Contains the results of cached bucket lists for this bucket type,
     * fetched from the API.
     * @property bucket-list
     * @type BucketList
     */
    bucketList: DS.belongsTo('bucket-list'),

    /**
     * Has the bucketList been loaded from the server?
     * @property isBucketListLoaded
     * @type Boolean
     * @default false
     */
    isBucketListLoaded: DS.attr('boolean', { defaultValue: false }),

    bucketTypeId: function() {
        return this.get('originalId');
    }.property('originalId'),

    /**
     * Returns the name of the cluster in which this bucket type resides.
     * (As specified in the `riak_explorer.conf` file)
     * @property clusterId
     * @type String
     */
    clusterId: function() {
        return this.get('cluster').get('clusterId');
    }.property('cluster'),

    /**
     * Returns the name of the Search Index associated with this bucket type,
     *     if applicable.
     * @property index
     * @type String
     */
    index: function() {
        return this.get('cluster').get('indexes')
            .findBy('name', this.get('props').get('searchIndexName'));
    }.property('cluster', 'props'),

    /**
     * Returns true if this Bucket Type has been activated.
     *
     * @property isActive
     * @type Boolean
     */
    isActive: function() {
        return this.get('props').get('isActive');
    }.property('props'),

    /**
     * Returns true if this Bucket Type has not yet been activated.
     *
     * @property isInactive
     * @type Boolean
     */
    isInactive: function() {
        return !this.get('isActive');
    }.property('props'),

    /**
     * Alias for the record's `id`, which is a composite ID in the form of
     *     `'<clusterId>/<bucketName>'`.
     * @see ExplorerResourceAdapter.normalizeId
     *
     * @property name
     * @type String
     * @example
     *    'dev-cluster/users'
     */
    name: function() {
        return this.get('id');
    }.property('id'),

    /**
     * Bucket Type name (unique per cluster),
     *    as appears on `riak-admin bucket-type list`
     * @property originalId
     * @type String
     */
    originalId: DS.attr('string'),

    /**
     * Bucket Type Properties object.
     * Note: Bucket Types and Buckets share the same Properties format.
     * When not specified, buckets inherit their properties from the Bucket Type
     * @property props
     * @type BucketProps
     */
    props: DS.belongsTo('bucket-props')
});

export default BucketType;
