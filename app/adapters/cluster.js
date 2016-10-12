import ApplicationAdapter from './application';

/**
 * @class ClusterAdapter
 * @namespace Adapters
 * @extends ApplicationAdapter
 */
export default ApplicationAdapter.extend({
  /**
   * Overrides application adapter urlForFindAll method.
   *
   * @method urlForFindAll
   * @return {String} url to use for FindAll method
   */
  urlForFindAll(modelName) {
    return `explore/clusters`;
  }
});
