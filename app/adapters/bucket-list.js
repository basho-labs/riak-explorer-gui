import ApplicationAdapter from './application';
import config from '../config/environment';

/**
 * @class BucketListAdapter
 * @namespace Adapters
 * @extends ApplicationAdapter
 */
export default ApplicationAdapter.extend({
  /**
   * Overrides application adapter queryRecord method.
   * Used to get a bucket types cached bucket list. Please refer to cached lists in the read me for more info on explorer cached lists.
   *
   * @method queryRecord
   * @return {Object} Promise object of the requested bucket list
   */
  queryRecord(store, type, query) {
    let url = `explore/clusters/${query.clusterName}/bucket_types/${query.bucketTypeName}/buckets?start=1&rows=${config.pageSize}`;

    let promise = this.ajax(url, 'GET').then(function(data) {
      if (data.buckets) {
        // Reformat response
        data.bucketList = data.buckets;

        delete data.buckets;
        delete data.bucketList.buckets;

        // Use compound key strategy to form id
        data.bucketList.id = `${query.clusterName}/${query.bucketTypeName}/bucketList`;
      }

      return data;
    });

    return promise;
  }
});
