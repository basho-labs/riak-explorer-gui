import Ember from "ember";
import ApplicationAdapter from './application';
import config from '../config/environment';

export default ApplicationAdapter.extend({
  buildURL(modelName, id, snapshot, requestType, query) {
    return `explore/clusters/${query.clusterName}/bucket_types/${query.bucketTypeName}/buckets/${query.bucketName}/keys?start=1&rows=${config.pageSize}`;
  },

  query(store, type, query) {
    let url = this.buildURL(type.modelName, null, null, 'query', query);

    let promise = this.ajax(url, 'GET').then(function(data) {
      if (data.keys && data.keys.keys) {
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
