import ApplicationAdapter from './application';
import config from '../config/environment';

export default ApplicationAdapter.extend({
  urlForQueryRecord(query, modelName) {
    return `explore/clusters/${query.clusterName}/bucket_types/${query.bucketTypeName}/buckets/${query.bucketName}/keys?start=1&rows=${config.pageSize}`;
  },

  queryRecord(store, type, query) {
    let url = this.urlForQueryRecord(query, type.modelName);

    let promise = this.ajax(url, 'GET').then(function(data) {
      if (data.keys) {
        data.objectList = data.keys;

        delete data.keys;
        delete data.objectList.keys;

        data.objectList.id = `${query.clusterName}/${query.bucketTypeName}/${query.bucketName}/objectList`;
      }

      return data;
    });

    return promise;
  },

  urlForDeleteRecord(id, modelName, snapshot) {
    let clusterName = snapshot.belongsTo('bucket').belongsTo('bucketType').belongsTo('cluster').id;
    let bucketTypeName = snapshot.belongsTo('bucket').belongsTo('bucketType').attr('name');
    let bucketName = snapshot.belongsTo('bucket').attr('name');

    return `explore/clusters/${clusterName}/bucket_types/${bucketTypeName}/buckets/${bucketName}/keys`;
  }
});
