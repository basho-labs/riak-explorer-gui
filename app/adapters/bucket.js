import Ember from "ember";
import ApplicationAdapter from './application';
import config from '../config/environment';

/**
 * @class BucketAdapter
 * @namespace Adapters
 * @extends ApplicationAdapter
 */
export default ApplicationAdapter.extend({
  /**
   * Overrides application adapter query method.
   * Used to read buckets from a given bucket type.
   * Buckets are read from a cached list, and as a result may be paginated. This is where ${config.pageSize} param comes into play.
   *
   * @method query
   * @return {Object} Promise object of the requested bucket
   */
  query(store, type, query) {
    let url = `explore/clusters/${query.clusterName}/bucket_types/${query.bucketTypeName}/buckets?start=1&rows=${config.pageSize}`;

    let promise = this.ajax(url, 'GET').then(function(data) {
      if (data.buckets && data.buckets.buckets) {
        data.buckets = data.buckets.buckets.map(function(bucketName) {
          // Use compound key strategy to form name/id
          return {
            id: `${query.clusterName}/${query.bucketTypeName}/${bucketName}`,
            name: bucketName
          };
        });
      }

      return data;
    });

    return promise;
  },

  /**
   * Overrides application adapter deleteRecord method.
   * Used to read buckets from a given bucket type.
   * Buckets are read from a cached list, and as a result may be paginated. This is where ${config.pageSize} param comes into play.
   *
   * @method deleteRecord
   * @return {Object} Promise object of the DELETE request
   */
  deleteRecord(store, type, snapshot) {
    let clusterName = snapshot.belongsTo('bucketType').belongsTo('cluster').id;
    let bucketTypeName = snapshot.belongsTo('bucketType').attr('name');
    let bucketName = snapshot.attr('name');
    let url = `explore/clusters/${clusterName}/bucket_types/${bucketTypeName}/buckets/${bucketName}`;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      Ember.$.ajax({
        type: "DELETE",
        url: url,
        success: function(data, textStatus, jqXHR) {
          resolve(jqXHR.status);
        },
        error: function(jqXHR, textStatus) {
          if (jqXHR.status === 202) {
            resolve(jqXHR.status);
          } else {
            reject(textStatus);
          }
        }
      });
    });
  }
});




