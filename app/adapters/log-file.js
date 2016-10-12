import ApplicationAdapter from './application';

/**
 * @class LogFileAdapter
 * @namespace Adapters
 * @extends ApplicationAdapter
 */
export default ApplicationAdapter.extend({
  /**
   * Overrides application adapter query method.
   * Used to read log files from a given node
   *
   * @method query
   * @return {Object} Promise object of the requested node log files
   */
  query(store, type, query) {
    let url = `explore/clusters/${query.clusterName}/nodes/${query.nodeName}/log/files`;

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
