import ApplicationAdapter from './application';
import config from '../config/environment';

export default ApplicationAdapter.extend({
  buildURL(modelName, id, snapshot, requestType, query) {
    return `${config.baseURL}explore/clusters/${query.clusterId}/nodes/${query.nodeId}/config/files`;
  },

  query(store, type, query) {
    let url = this.buildURL(type.modelName, null, null, 'query', query);

    let promise = this.ajax(url, 'GET').then(function(data) {

      data.files.forEach(function(file) {
        // assign id to file id
        file.file_id = file.id;
        // Then create a composite id for the file
        file.id = `${query.clusterId}/${query.nodeId}/${file.file_id}`;
      });

      return data;
    });

    return promise;
  }
});
