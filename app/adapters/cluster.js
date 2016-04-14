import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForFindAll(modelName) {
    return `explore/clusters`;
  }
});
