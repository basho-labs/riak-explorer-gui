import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  // Cluster Routes
  this.route('cluster.ops', {path: '/cluster/:clusterName/ops'});
  this.route('cluster.data', {path: '/cluster/:clusterName/data'});
  this.route('cluster.query', {path: '/cluster/:clusterName/query'});

  // Cluster-Data Routes
  this.route('bucket-type', {path: '/cluster/:clusterId/data/bucket_type/:bucketTypeId'});
  this.route('bucket', {path: '/cluster/:clusterId/data/bucket_type/:bucketTypeId/bucket/:bucketId'});
  this.route('riak-object', {path: '/cluster/:clusterId/data/bucket_type/:bucketTypeId/bucket/:bucketId/key/:key'});
  this.route('riak-object.edit', {path: '/cluster/:clusterId/data/bucket_type/:bucketTypeId/bucket/:bucketId/key/:key/edit'});
  this.route('riak-object.counter', {path: '/cluster/:clusterId/data/bucket_type/:bucketTypeId/bucket/:bucketId/counter/:key'});
  this.route('riak-object.set', {path: '/cluster/:clusterId/data/bucket_type/:bucketTypeId/bucket/:bucketId/set/:key'});
  this.route('riak-object.map', {path: '/cluster/:clusterId/data/bucket_type/:bucketTypeId/bucket/:bucketId/map/:key'});

  // Cluster-Ops Routes
  this.route('node', {path: '/cluster/:clusterId/ops/nodes/:nodeId/'});
  this.route('log-file', {path: '/cluster/:clusterId/ops/nodes/:nodeId/logs/:logId'});
  this.route('config-file', {path: '/cluster/:clusterId/ops/nodes/:nodeId/configs/:configId'});

  // Cluster-Query Routes
  this.route('search-index', {path: '/cluster/:clusterId/query/index/:searchIndexId'});
  this.route('search-schema', {path: '/cluster/:clusterId/query/schema/:searchSchemaId'});
  this.route('search-schema.edit', {path: '/cluster/:clusterId/query/schema/:searchSchemaId/edit'});
  this.route('search-schema.create', {path: '/cluster/:clusterId/query/schema/create'});

  // Error Routes
  this.route('error', {path: '/error'}, function() {
    this.route('unknown');
    this.route('cluster-not-found');
    this.route('object-not-found');
    this.route('service-not-found');
  });

  // Misc. Routes
  this.route('help');
});

export default Router;
