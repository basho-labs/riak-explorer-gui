import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  buildURL(modelName, id, snapshot, requestType, query) {
    return `explore/clusters/${query.clusterName}/nodes/${query.nodeName}/config/files`;
  },

  query(store, type, query) {
    let url = this.buildURL(type.modelName, null, null, 'query', query);

    let promise = this.ajax(url, 'GET').then(function(data) {

      data.files.forEach(function(file) {
        // assign id to file id
        file.name = file.id;
        // Then create a composite id for the file
        file.id = `${query.clusterId}/${query.nodeId}/${file.name}`;
      });

      return data;
    });

    return promise;
  }
});
