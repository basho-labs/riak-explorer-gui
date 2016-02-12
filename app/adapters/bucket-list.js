import ApplicationAdapter from './application';
import config from '../config/environment';

export default ApplicationAdapter.extend({
  urlForQueryRecord(query, modelName) {
    // TODO: Inject start and rows
    return `${config.baseURL}explore/clusters/${query.clusterName}/bucket_types/${query.bucketTypeName}/buckets?start=1&rows=500`;
  },

  queryRecord(store, type, query) {
    let url = this.urlForQueryRecord(query, type.modelName);

    let promise = this.ajax(url, 'GET').then(function(data) {
      if (data.buckets) {
        data.bucketList = data.buckets;

        delete data.buckets;
        delete data.bucketList.buckets;

        data.bucketList.id = `${query.clusterName}/${query.bucketTypeName}/bucketList`
      }

      return data;
    });

    return promise;
  }
});
