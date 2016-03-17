import ApplicationAdapter from './application';
import config from '../config/environment';

export default ApplicationAdapter.extend({
  buildURL(modelName, id, snapshot, requestType, query) {
    return `${config.baseURL}explore/clusters/${query.clusterName}/bucket_types`;
  },

  query(store, type, query) {
    let url = this.buildURL(type.modelName, null, null, 'query', query);

    let promise = this.ajax(url, 'GET').then(function(data) {
      data.bucket_types.forEach(function(bucketType) {
        bucketType.name = bucketType.id;
        bucketType.id = `${query.clusterName}/${bucketType.name}`;
      });

      return data;
    });

    return promise;
  }
});
