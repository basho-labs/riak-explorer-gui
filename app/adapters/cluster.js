import ApplicationAdapter from './application';
import config from '../config/environment';

export default ApplicationAdapter.extend({
  urlForFindAll(modelName) {
    return `${config.baseURL}explore/clusters`;
  }
});
