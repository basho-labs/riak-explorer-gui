import ApplicationSerializer from './application';
import Ember from 'ember';

export default ApplicationSerializer.extend({
  normalizeResponse: function(store, primaryModelClass, payload, id, requestType) {
    let sortBy = Ember.Enumerable.sortBy;

    payload.clusters = payload.clusters.sortBy('id');

    // convert riak type to be more readable
    payload.clusters.forEach(function(cluster) {
      switch(cluster.riak_type) {
        case 'oss':
          cluster.riak_type = 'kv_oss';
          cluster.riak_type_long = 'KV Open Source';
          break;
        case 'ee':
          cluster.riak_type = 'kv_ee';
          cluster.riak_type_long = 'KV Enterprise Edition';
          break;
        case 'ts':
          cluster.riak_type = 'ts_oss';
          cluster.riak_type_long = 'TS Open Source';
          break;
        case 'ts_ee':
          cluster.riak_type_long = 'TS  Enterprise Edition';
          break;
        default:
          break;
      }
    });

    return this._super(store, primaryModelClass, payload, id, requestType);
  }
});
