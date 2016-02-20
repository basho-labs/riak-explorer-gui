import ApplicationAdapter from './application';
import config from '../config/environment';
import clusterProxyUrl from '../utils/cluster-proxy-url';

export default ApplicationAdapter.extend({
  buildURL(modelName, id, snapshot, requestType, query) {
    return `${config.baseURL}explore/clusters/${query.clusterName}/bucket_types/${query.bucketTypeName}/buckets/${query.bucketName}/keys?start=1&rows=${config.pageSize}`;
  },

  query(store, type, query) {
    let url = this.buildURL(type.modelName, null, null, 'query', query);

    let promise = this.ajax(url, 'GET').then(function(data) {
      if (data.keys && data.keys.keys) {
        data.riak_objects = data.keys.keys.map(function(key) {
          return {
            id: `${query.clusterName}/${query.bucketTypeName}/${query.bucketName}/${key}`,
            name: key
          }
        });

        delete data.keys;
      }

      return data;
    });

    return promise;
  },

  deleteRecord(store, type, snapshot) {
    let clusterName = snapshot.belongsTo('bucket').belongsTo('bucketType').belongsTo('cluster').id;
    let bucketTypeName = snapshot.belongsTo('bucket').belongsTo('bucketType').attr('name');
    let bucketName = snapshot.belongsTo('bucket').attr('name');
    let objectName = snapshot.attr('name');
    let clusterUrl = clusterProxyUrl(clusterName);
    let vClock = snapshot.attr('headers').other['x-riak-vclock']
    let url = `${clusterUrl}/types/${bucketTypeName}/buckets/${bucketName}/keys/${objectName}`;

    return Ember.$.ajax({
      type: "DELETE",
      url: url,
      headers: {'X-Riak-Vclock': vClock}
    });
  }
});
