import ApplicationAdapter from './application';
import config from '../config/environment';

export default ApplicationAdapter.extend({
  urlForQueryRecord(query, modelName) {
    return `explore/clusters/${query.clusterName}/bucket_types/${query.bucketTypeName}/buckets?start=1&rows=${config.pageSize}`;
  },

  queryRecord(store, type, query) {
    let url = this.urlForQueryRecord(query, type.modelName);

    let promise = this.ajax(url, 'GET').then(function(data) {
      if (data.buckets) {
        data.bucketList = data.buckets;

        delete data.buckets;
        delete data.bucketList.buckets;

        data.bucketList.id = `${query.clusterName}/${query.bucketTypeName}/bucketList`;
      }

      return data;
    });

    return promise;
  }
});
