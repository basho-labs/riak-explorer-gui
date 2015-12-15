import DS from 'ember-data';
import config from '../../config/environment';

/**
 * Represents a Riak cluster as a whole.
 *
 * @class Cluster
 * @extends DS.Model
 * @constructor
 * @uses BucketType
*/
var Cluster = DS.Model.extend({
    /**
     * Bucket types created on the cluster
     * @property bucketTypes
     * @type Array<BucketType>
     */
    bucketTypes: DS.hasMany('bucket-type'),

    /**
     * Riak nodes assigned to the cluster
     * @property riakNodes
     * @type Array<BucketType>
     */
    riakNodes: DS.hasMany('riak-node', { async: true }),

    /**
     * Is this cluster in Dev Mode? Set in the Explorer config file.
     * Dev mode allows expensive operations like list keys, delete bucket, etc.
     * @property developmentMode
     * @type Boolean
     * @default false
     */
    developmentMode: DS.attr('boolean', {defaultValue: false}),

    /**
     * List of Search Indexes that have been created on this cluster.
     * @see http://docs.basho.com/riak/latest/dev/using/search/
     * @property indexes
     * @type Array<Hash>
     * @example
     *    [{"name":"customers","n_val":3,"schema":"_yz_default"}]
     */
    indexes: DS.attr(),

    /**
     * The Riak Type: either Open Source (oss) or Enterprise Edition (ee)
     * @property riakType
     * @type String
     */
    riakType: DS.attr('string', { defaultValue: 'oss' }),

    /**
     * Returns a list of currently activated bucket types.
     *
     * @method activeBucketTypes
     * @return {Array<BucketType>}
     */
    activeBucketTypes: function() {
        return this.get('bucketTypes').filterBy('isActive');
    }.property('bucketTypes'),

    /**
     * Returns the name of the cluster
     * (As specified in the `riak_explorer.conf` file)
     * Note: Currently unrelated to the source/datacenter name used by MDC Repl
     * @property clusterId
     * @type String
     */
    clusterId: function() {
        return this.get('id');
    }.property('id'),

    /**
     * Returns a list of un-activated bucket types.
     *
     * @method inactiveBucketTypes
     * @return {Array<BucketType>}
     */
    inactiveBucketTypes: function() {
        return this.get('bucketTypes').filterBy('isInactive');
    }.property('bucketTypes'),

    /**
     * Boolean test on if the riakType is the open source edition
     *
     * @method isOpenSourceEdition
     * @return Boolean
     */
    isOpenSourceEdition: function() {
      return this.get('riakType') === 'oss';
    }.property('riakType'),

    /**
     * Boolean test on if the riakType is the enterprise edition
     *
     * @method isEnterpriseEdition
     * @return Boolean
     */
    isEnterpriseEdition: function() {
        return this.get('riakType') === 'ee';
    }.property('riakType'),

    /**
     * Returns true if this cluster is in production mode (development_mode=off)
     * @method productionMode
     * @type Boolean
     */
    productionMode: function() {
        return !this.get('developmentMode');
    }.property('developmentMode'),

    /**
     * Returns the URL which Explorer uses to forward requests to the cluster.
     * Used to link to Search schemas, on the Cluster view.
     * Having the config and url here is hacky, but no good alternatives.
     * @method proxyUrl
     * @return {String} URL
     */
    proxyUrl: function() {
        return config.baseURL + 'riak/clusters/' + this.get('id');
    }.property('id')
});

export default Cluster;
