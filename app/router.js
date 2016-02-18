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
  this.route('bucket-type', {path: '/cluster/:clusterName/data/bucket_type/:bucketTypeName'});
  this.route('bucket', {path: '/cluster/:clusterName/data/bucket_type/:bucketTypeName/bucket/:bucketName'});
  this.route('riak-object', {path: '/cluster/:clusterName/data/bucket_type/:bucketTypeName/bucket/:bucketName/key/:objectName'});
  this.route('riak-object.edit', {path: '/cluster/:clusterName/data/bucket_type/:bucketTypeName/bucket/:bucketName/key/:objectName/edit'});
  this.route('riak-object.counter', {path: '/cluster/:clusterName/data/bucket_type/:bucketTypeName/bucket/:bucketName/counter/:objectName'});
  this.route('riak-object.set', {path: '/cluster/:clusterName/data/bucket_type/:bucketTypeName/bucket/:bucketName/set/:objectName'});
  this.route('riak-object.map', {path: '/cluster/:clusterName/data/bucket_type/:bucketTypeName/bucket/:bucketName/map/:objectName'});

  // Cluster-Ops Routes
  this.route('node', {path: '/cluster/:clusterName/ops/nodes/:nodeName/'});
  this.route('log-file', {path: '/cluster/:clusterName/ops/nodes/:nodeName/logs/:logName'});
  this.route('config-file', {path: '/cluster/:clusterName/ops/nodes/:nodeName/configs/:configName'});

  // Cluster-Query Routes
  this.route('search-index', {path: '/cluster/:clusterName/query/index/:searchIndexName'});
  this.route('search-schema', {path: '/cluster/:clusterName/query/schema/:searchSchemaName'});
  this.route('search-schema.edit', {path: '/cluster/:clusterName/query/schema/:searchSchemaName/edit'});
  this.route('search-schema.create', {path: '/cluster/:clusterName/query/schema/create'});

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
