import ApplicationAdapter from './application';
import config from '../config/environment';

export default ApplicationAdapter.extend({
  buildURL(modelName, id, snapshot, requestType, query) {
    return `${config.baseURL}explore/clusters/${query.clusterName}/bucket_types/${query.bucketTypeName}/buckets?start=1&rows=${config.pageSize}`;
  },

  query(store, type, query) {
    let url = this.buildURL(type.modelName, null, null, 'query', query);

    let promise = this.ajax(url, 'GET').then(function(data) {
      if (data.buckets && data.buckets.buckets) {
        data.buckets = data.buckets.buckets.map(function(bucketName) {
          return {
            id: `${query.clusterName}/${query.bucketTypeName}/${bucketName}`,
            name: bucketName
          }
        });
      }

      return data;
    });

    return promise;
  },

  deleteRecord(store, type, snapshot) {
    let clusterName = snapshot.belongsTo('bucketType').belongsTo('cluster').id;
    let bucketTypeName = snapshot.belongsTo('bucketType').attr('name');
    let bucketName = snapshot.attr('name');
    let url = `${config.baseURL}explore/clusters/${clusterName}/bucket_types/${bucketTypeName}/buckets/${bucketName}`;

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




