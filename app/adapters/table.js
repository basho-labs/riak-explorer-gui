import ApplicationAdapter from './application';
import Ember from 'ember';

export default ApplicationAdapter.extend({
  buildURL(modelName, id, snapshot, requestType, query) {
    // TS Tables use same end point as bucket types, differentiated by "ddl" property
    return `explore/clusters/${query.clusterName}/bucket_types`;
  },

  query(store, type, query) {
    let url = this.buildURL(type.modelName, null, null, 'query', query);

    let promise = this.ajax(url, 'GET').then(function(data) {

      // Remove any kv bucket types, they are added by the bucket-type adapter.
      // Time series tables are identified by the "ddl" property.
      data.tables = data.bucket_types.filter(function(bt) {
        return Ember.isPresent(bt.props.ddl);
      });

      delete data.bucket_types;

      data.tables.forEach(function(table) {
        table.name = table.id;
        table.id = `${query.clusterName}/${table.name}`;
      });

      return data;
    });

    return promise;
  }
});
