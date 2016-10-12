import ApplicationAdapter from './application';

/**
 * @class NodeAdapter
 * @namespace Adapters
 * @extends ApplicationAdapter
 */
export default ApplicationAdapter.extend({
  /**
   * Overrides application adapter query method.
   * Used to read nodes from a given cluster.
   *
   * @method query
   * @return {Object} Promise object of the requested nodes
   */
  query(store, type, query) {
    let url = `explore/clusters/${query.clusterName}/nodes`;

    let promise = this.ajax(url, 'GET').then(function(data) {
      // Use compound key strategy to form name/id
      data.nodes.forEach(function(node) {
        node.name = node.id;
        node.id = `${query.clusterName}/${node.name}`;
      });

      return data;
    });

    return promise;
  }
});
