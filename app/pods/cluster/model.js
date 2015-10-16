import DS from 'ember-data';
import config from '../../config/environment';

/**
* Represents a Riak cluster as a whole.
*/
var Cluster = DS.Model.extend({
    activeBucketTypes: function() {
        return this.get('bucketTypes').filterBy('isActive');
    }.property('bucketTypes'),

    // Bucket types created on the cluster
    bucketTypes: DS.hasMany('bucket-type'),

    clusterId: function() {
        return this.get('id');
    }.property('id'),

    // Riak node through which Explorer connects to the riak cluster
    riakNode: DS.attr('string', {defaultValue: null}), //'riak@127.0.0.1'

    // Is this cluster in Dev Mode? Set in the Explorer config file
    // Dev mode allows expensive operations like list keys, delete bucket, etc
    developmentMode: DS.attr('boolean', {defaultValue: false}),

    inactiveBucketTypes: function() {
        return this.get('bucketTypes').filterBy('isInactive');
    }.property('bucketTypes'),

    // (Solr) Search Indexes in the cluster
    indexes: DS.attr(),

    // Nodes belonging to the cluster
    nodes: DS.attr(),

    productionMode: function() {
        return !this.get('developmentMode');
    }.property('developmentMode'),

    // URL which Explorer uses to forward requests to the Riak cluster
    // Currently in the form of /riak/clusters/$clusterId
    // This is used to link to Search schemas, on the Cluster view.
    // Having the config and url here is hacky, but no good alternatives.
    proxyUrl: function() {
        return config.baseURL + 'riak/clusters/' + this.get('id');
    }.property('id')
});

export default Cluster;
