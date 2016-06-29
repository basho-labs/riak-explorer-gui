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
  this.route('bucket-type.create', {path: '/cluster/:clusterName/data/bucket_type/create'});
  this.route('bucket-type.edit', {path: '/cluster/:clusterName/data/bucket_type/:bucketTypeName/edit'});
  this.route('bucket', {path: '/cluster/:clusterName/data/bucket_type/:bucketTypeName/bucket/:bucketName'});
  this.route('riak-object', {path: '/cluster/:clusterName/data/bucket_type/:bucketTypeName/bucket/:bucketName/key/:objectName'});
  this.route('riak-object.edit', {path: '/cluster/:clusterName/data/bucket_type/:bucketTypeName/bucket/:bucketName/key/:objectName/edit'});
  this.route('riak-object.counter', {path: '/cluster/:clusterName/data/bucket_type/:bucketTypeName/bucket/:bucketName/counter/:objectName'});
  this.route('riak-object.set', {path: '/cluster/:clusterName/data/bucket_type/:bucketTypeName/bucket/:bucketName/set/:objectName'});
  this.route('riak-object.map', {path: '/cluster/:clusterName/data/bucket_type/:bucketTypeName/bucket/:bucketName/map/:objectName'});
  this.route('riak-object.map.edit', {path: '/cluster/:clusterName/data/bucket_type/:bucketTypeName/bucket/:bucketName/map/:objectName/edit'});
  this.route('table', {path: '/cluster/:clusterName/data/table/:tableName'});
  this.route('table.query', {path: '/cluster/:clusterName/data/table/:tableName/query'});
  this.route('table.write', {path: '/cluster/:clusterName/data/table/:tableName/write'});
  this.route('table.create', {path: '/cluster/:clusterName/data/table/create'});

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
  this.route('error', {path: '*path'}); // Catch all for any unmatched routes
  this.route('error.service-not-found', {path: '/error/service-not-found'});

  // Misc. Routes
  this.route('help');
});

export default Router;
