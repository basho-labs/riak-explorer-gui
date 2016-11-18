import Ember from "ember";
import ApplicationAdapter from './application';
import config from '../config/environment';

/**
 * @class RiakObjectAdapter
 * @namespace Adapters
 * @extends ApplicationAdapter
 */
export default ApplicationAdapter.extend({
  /**
   * Overrides application adapter query method.
   * Used to read objects from a given bucket.
   *
   * @method query
   * @return {Object} Promise object of the requested object
   */
  query(store, type, query) {
    let url = `explore/clusters/${query.clusterName}/bucket_types/${query.bucketTypeName}/buckets/${query.bucketName}/keys?start=1&rows=${config.pageSize}`;

    let promise = this.ajax(url, 'GET').then(function(data) {
      if (data.keys && data.keys.keys) {
        // Use compound key strategy to form name/id
        data.riak_objects = data.keys.keys.map(function(key) {
          return {
            id: `${query.clusterName}/${query.bucketTypeName}/${query.bucketName}/${key}`,
            name: key
          };
        });

        delete data.keys;
      }

      return data;
    });

    return promise;
  },

  /**
   * Overrides application adapter createRecord method.
   * Creating a record and updating a record use same api, forward this method to that one
   *
   * @method createRecord
   */
  createRecord(store, type, snapshot) {
    return this.updateRecord(store, type, snapshot);
  },

  /**
   * Performs a limited 'Delete Bucket' command via the Explorer API.
   * (This is done as a convenience operation for Devs, since Riak doesn't
   * currently support a whole-bucket delete.)
   * To be more precise, the Explorer backend iterates through all the keys
   * in its Key List cache for that bucket, and issues Delete Object commands
   * for those keys.
   *
   * Limitations:
   * - This is only available in Development Mode
   * - Explorer can only delete objects whose keys are in its cache.
   *
   * Note: This means that the object list cache must already be populated for a delete action to be taken on the
   *  bucket
   *
   * @method deleteRecord
   * @return {Object} Promise object of the request
   */
  deleteRecord(store, type, snapshot) {
    let object = snapshot.record;
    let clusterUrl = object.get('cluster').get('proxyUrl');
    let bucketTypeName = object.get('bucketType').get('name');
    let bucketName = object.get('bucket').get('name');
    let objectName = object.get('name');
    let url = `${clusterUrl}/types/${bucketTypeName}/buckets/${bucketName}/keys/${objectName}`;

    return Ember.$.ajax({
      type: "DELETE",
      url: url,
      headers: {'X-Riak-Vclock': object.get('causalContext')}
    });
  },

  /**
   * Overrides application adapter updateRecord method.
   * Creates new riak object for a given bucket
   *
   * @method updateRecord
   * @return {Object} Promise object of the request
   */
  updateRecord(store, type, snapshot) {
    let object = snapshot.record;
    let clusterUrl = object.get('cluster').get('proxyUrl');
    let bucketTypeName = object.get('bucketType').get('name');
    let bucketName = object.get('bucket').get('name');
    let objectName = object.get('name');
    let url = `${clusterUrl}/types/${bucketTypeName}/buckets/${bucketName}/keys/${objectName}`;
    let headers = {};

    if (object.get('causalContext')) {
      headers['X-Riak-Vclock'] = object.get('causalContext');
    }
    if (object.get('indexes')) {
      object.get('indexes').forEach(function(index) {
        headers[index.key] = index.value;
      });
    }
    if (object.get('headersCustom')) {
      object.get('headersCustom').forEach(function(header) {
        headers[header.key] = header.value;
      });
    }

    return Ember.$.ajax({
      type: 'PUT',
      processData: false,
      contentType: object.get('contentType') || 'application/json',
      url: url,
      headers: headers,
      data: JSON.stringify(object.get('contents'))
    });
  }
});
