import DS from 'ember-data';
import CachedList from "./cached-list";

/**
 * Represents a list of buckets in the current bucket type,
 * cached by the Explorer API.
 *
 * @class BucketList
 * @extends CachedList
 * @constructor
 * @uses BucketType
 * @uses Bucket
 * @uses Cluster
 */

var BucketList = CachedList.extend({
    /**
     * List of Bucket model instances (loaded from the server)
     * @property buckets
     * @type Array<Bucket>
     * @default []
     */
    buckets: DS.attr(null, {defaultValue: []}),

    /**
     * The bucket type that owns this bucket list.
     * @property bucketType
     * @type BucketType
     */
    bucketType: DS.belongsTo('bucket-type'),

    /**
     * The cluster in which this bucket type resides.
     * @property cluster
     * @type Cluster
     */
    cluster: DS.belongsTo('cluster'),

    /**
     * The max amount of records that should be fetched in a given request
     * @property maxBucketsPerRequest
     * @type Integer
     * @default 100
     */
    maxBucketsPerRequest: DS.attr('integer', { defaultValue: 100 }),

    /**
     * @property bucketTypeId
     * @type String
     */
    bucketTypeId: function() {
        return this.get('bucketType').get('bucketTypeId');
    }.property('bucketType'),

    /**
     * @property clusterId
     * @type String
     */
    clusterId: function() {
        return this.get('cluster').get('clusterId');
    }.property('cluster')
});
export default BucketList;
