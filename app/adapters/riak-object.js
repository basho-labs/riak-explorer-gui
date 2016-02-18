import ApplicationAdapter from './application';
import config from '../config/environment';

export default ApplicationAdapter.extend({
  buildURL(modelName, id, snapshot, requestType, query) {
    return `${config.baseURL}explore/clusters/${query.clusterName}/bucket_types/${query.bucketTypeName}/buckets/${query.bucketName}/keys?start=1&rows=${config.pageSize}`;
  },

  query(store, type, query) {
    let url = this.buildURL(type.modelName, null, null, 'query', query);

    let promise = this.ajax(url, 'GET').then(function(data) {
      if (data.keys && data.keys.keys) {
        data.riak_objects = data.keys.keys.map(function(key) {
          return {
            id: `${query.clusterName}/${query.bucketTypeName}/${query.bucketName}/${key}`,
            name: key
          }
        });

        delete data.keys;
      }

      return data;
    });

    return promise;
  },

  findRecord(store, type, id, snapshot) {
    debugger;
  }
});
