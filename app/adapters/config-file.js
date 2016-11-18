import ApplicationAdapter from './application';

/**
 * @class ConfigFileAdapter
 * @namespace Adapters
 * @extends ApplicationAdapter
 */
export default ApplicationAdapter.extend({
  /**
   * Overrides application adapter query method.
   * Used to read configuration files from a given node
   *
   * @method query
   * @return {Object} Promise object of the requested node config files
   */
  query(store, type, query) {
    let url = `explore/clusters/${query.clusterName}/nodes/${query.nodeName}/config/files`;

    let promise = this.ajax(url, 'GET').then(function(data) {

      data.files.forEach(function(file) {
        // Use compound key strategy to form name/id
        file.name = file.id;
        file.id = `${query.clusterName}/${query.nodeName}/${file.name}`;
      });

      return data;
    });

    return promise;
  }
});
