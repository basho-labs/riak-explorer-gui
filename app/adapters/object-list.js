import ApplicationAdapter from './application';
import config from '../config/environment';

export default ApplicationAdapter.extend({
  urlForQueryRecord(query, modelName) {
    return `${config.baseURL}explore/clusters/${query.clusterName}/bucket_types/${query.bucketTypeName}/buckets/${query.bucketName}/keys?start=1&rows=${config.pageSize}`;
  },

  queryRecord(store, type, query) {
    let url = this.urlForQueryRecord(query, type.modelName);

    let promise = this.ajax(url, 'GET').then(function(data) {

      if (data.keys) {
        data.objectList = data.keys;

        delete data.keys;
        delete data.objectList.keys;

        data.objectList.id = `${query.clusterName}/${query.bucketTypeName}/${query.bucketName}/objectList`
      }

      return data;
    });

    return promise;
  }
});