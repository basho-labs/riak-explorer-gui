import ApplicationAdapter from './application';
import config from '../config/environment';

export default ApplicationAdapter.extend({
  buildURL(modelName, id, snapshot, requestType, query) {
    return `${config.baseURL}explore/clusters/${query.clusterId}/nodes`;
  },

  query(store, type, query) {
    let url = this.buildURL(type.modelName, null, null, 'query', query);

    return this.ajax(url, 'GET');
  }
});
