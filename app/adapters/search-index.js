import DS from 'ember-data';

/**
 * @class SearchIndexAdapter
 * @namespace Adapters
 * @extends ApplicationAdapter
 */
var SearchIndexAdapter = DS.RESTAdapter.extend({
  /**
   * Overrides application adapter query method.
   * Used to read search indexes from a given cluster.
   *
   * @method query
   * @return {Object} Promise object of the requested object
   */
  query(store, type, query) {
    let url = `riak/clusters/${query.clusterName}/search/index`;

    let promise = this.ajax(url, 'GET').then(function(indexes) {
      // Use compound key strategy to form id
      indexes.forEach(function(index) {
        index.id = `${query.clusterName}/${index.name}`;
      });

      return indexes;
    });

    return promise;
  }
});

export default SearchIndexAdapter;
