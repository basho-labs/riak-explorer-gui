import ApplicationAdapter from './application';
import config from '../config/environment';

/**
 * @class ObjectListAdapter
 * @namespace Adapters
 * @extends ApplicationAdapter
 */
export default ApplicationAdapter.extend({
  /**
   * Overrides application adapter queryRecord method.
   * Used to get a buckets cached object list. Please refer to cached lists in the read me for more info on explorer cached lists.
   *
   * @method queryRecord
   * @return {Object} Promise object of the requested bucket list
   */
  queryRecord(store, type, query) {
    let url = `explore/clusters/${query.clusterName}/bucket_types/${query.bucketTypeName}/buckets/${query.bucketName}/keys?start=1&rows=${config.pageSize}`;

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

  /**
   * Overrides application adapter urlForDeleteRecord method.
   *
   * @method queryRecord
   * @return {String} Url string of DELETE request
   */
  urlForDeleteRecord(id, modelName, snapshot) {
    let clusterName = snapshot.belongsTo('bucket').belongsTo('bucketType').belongsTo('cluster').id;
    let bucketTypeName = snapshot.belongsTo('bucket').belongsTo('bucketType').attr('name');
    let bucketName = snapshot.belongsTo('bucket').attr('name');

    return `explore/clusters/${clusterName}/bucket_types/${bucketTypeName}/buckets/${bucketName}/keys`;
  }
});
