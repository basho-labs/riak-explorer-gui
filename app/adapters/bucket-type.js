import ApplicationAdapter from './application';
import Ember from 'ember';

export default ApplicationAdapter.extend({
  buildURL(modelName, id, snapshot, requestType, query) {
    return `explore/clusters/${query.clusterName}/bucket_types`;
  },

  query(store, type, query) {
    let url = this.buildURL(type.modelName, null, null, 'query', query);

    let promise = this.ajax(url, 'GET').then(function(data) {

      // Remove any time series table bucket types, they are added by the table adapter.
      // Time series tables are identified by the "ddl" property.
      data.bucket_types = data.bucket_types.filter(function(bt) {
        return Ember.isNone(bt.props.ddl);
      });

      data.bucket_types.forEach(function(bucketType) {
        bucketType.name = bucketType.id;
        bucketType.id = `${query.clusterName}/${bucketType.name}`;
      });

      return data;
    });

    return promise;
  }
});
