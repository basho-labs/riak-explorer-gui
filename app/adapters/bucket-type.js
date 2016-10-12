import ApplicationAdapter from './application';
import Ember from 'ember';

/**
 * @class BucketTypeAdapter
 * @namespace Adapters
 * @extends ApplicationAdapter
 */
export default ApplicationAdapter.extend({
  /**
   * Overrides application adapter query method.
   * Used to read bucket types from a given cluster.
   *
   * @method query
   * @return {Object} Promise object of the requested bucket type
   */
  query(store, type, query) {
    let url = `explore/clusters/${query.clusterName}/bucket_types`;

    let promise = this.ajax(url, 'GET').then(function(data) {
      // Remove any time series table bucket types, they are added by the TableAdapter.
      // Time series tables are identified by the "ddl" property.
      data.bucket_types = data.bucket_types.filter(function(bt) {
        return Ember.isNone(bt.props.ddl);
      });

      data.bucket_types.forEach(function(bucketType) {
        // Use compound key strategy to form name/id
        bucketType.name = bucketType.id;
        bucketType.id = `${query.clusterName}/${bucketType.name}`;
      });

      return data;
    });

    return promise;
  }
});
