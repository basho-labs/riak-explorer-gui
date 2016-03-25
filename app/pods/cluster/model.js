import DS from 'ember-data';
import Config from '../../config/environment';
import Replication from '../../mixins/models/cluster-replication';

/**
 * Represents a Riak cluster as a whole.
 *
 * @class Cluster
 * @extends DS.Model
 * @constructor
 * @uses BucketType
 */
var Cluster = DS.Model.extend(Replication, {
  /**
   * Bucket types created on the cluster
   * @property bucketTypes
   * @type Array<BucketType>
   */
  bucketTypes: DS.hasMany('bucket-type'),

  /**
   * Riak nodes assigned to the cluster
   * @property nodes
   * @type Array<BucketType>
   */
  nodes: DS.hasMany('node'),

  /**
   * Search indexes created on the cluster
   * @property searchIndexes
   * @type Array<BucketType>
   */
  searchIndexes: DS.hasMany('search-index'),

  /**
   * Search schemas created on the cluster
   * @property searchSchemas
   * @type Array<BucketType>
   */
  searchSchemas: DS.hasMany('search-schema'),

  /**
   * Is this cluster in Dev Mode? Set in the Explorer config file.
   * Dev mode allows expensive operations like list keys, delete bucket, etc.
   * @property developmentMode
   * @type Boolean
   * @default false
   */
  developmentMode: DS.attr('boolean', {defaultValue: false}),

  /**
   * The Riak Type: either Open Source (oss), Enterprise Edition (ee), or "unavailable"
   * @property riakType
   * @type String
   */
  riakType: DS.attr('string', {defaultValue: 'oss'}),

  /**
   * Riak Version
   * @property riakVersion
   * @type String
   */
  riakVersion: DS.attr('string'),

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
   * Boolean check to see if the cluster has a Riak version number associated with it
   *
   * @method hasVersion
   * @returns Boolean
   */
  hasVersion: function() {
    return (this.get('riakVersion') && this.get('riakVersion') !== "unavailable");
  }.property('riakVersion'),

  /**
   * Boolean check to see if the cluster has a Riak type associated with it
   *
   * @method hasType
   * @returns Boolean
   */
  hasType: function() {
    return (this.get('riakType') && this.get('riakType') !== "unavailable");
  }.property('riakType'),

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
   * Returns the name of the cluster
   * (As specified in the `riak_explorer.conf` file)
   * Note: Currently unrelated to the source/datacenter name used by MDC Repl
   * @method clusterId
   * @type String
   */
  name: function() {
    return this.get('id');
  }.property('id'),

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
    return `${Config.baseURL}riak/clusters/${this.get('name')}`;
  }.property('name'),

  /**
   * Calculates cluster status based on node health. If all child nodes are valid and
   *  available, status is "ok". If some child nodes are unavailable or invalid, status is
   *  "warning". If all child nodes are unavailable or invalid, status is "down".
   *
   * @method status
   * @return {String} Status
   */
  status: function() {
    let nodes = this.get('nodes');
    let totalNodes = nodes.get('length');
    let totalHealthyNodes = 0;
    let totalUnhealthyNodes = 0;
    let status = null;

    // Calculate how many nodes are healthy/unhealthy
    nodes.forEach(function(node) {
      if (node.get('isHealthy')) {
        totalHealthyNodes++;
      } else {
        totalUnhealthyNodes++;
      }
    });

    if (totalUnhealthyNodes === totalNodes || totalNodes < 1) {
      status = 'down';
    } else if (totalHealthyNodes === totalNodes) {
      status = 'ok';
    } else {
      status = 'warning';
    }

    return status;
  }.property('nodes.@each.isHealthy'),

  warnings: function() {
    let warnings = {};

    if (this.get('productionMode') && this.get('nodes').get('length') < 5) {
      warnings.insufficientNodes = "For production deployments we recommend using no fewer than 5 nodes, as node " +
        "failures in smaller clusters can compromise the fault-tolerance of the system.";
    }

    return warnings;
  }.property('productionMode', 'nodes')
});

export default Cluster;
