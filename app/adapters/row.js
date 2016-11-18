import ApplicationAdapter from './application';

/**
 * @class RowAdapter
 * @namespace Adapters
 * @extends ApplicationAdapter
 */
export default ApplicationAdapter.extend({
  /**
   * Overrides application adapter query method.
   * Used to read table rows from a given time series table
   *
   * @method query
   * @return {Object} Promise object of the requested object
   */
  query(store, type, query) {
    // TS Tables use same end point as bucket types, differentiated by "ddl" property
    let url = `explore/clusters/${query.clusterName}/tables/${query.tableName}/keys`;

    let promise = this.ajax(url, 'GET').then(function(data) {
      if (data.keys && data.keys.keys) {
        data.rows = data.keys.keys.map(function(rowValue, index) {
          // Use compound key strategy to form name/id
          return {
            value: rowValue,
            index: index,
            id: `${query.clusterName}/${query.tableName}/${index}`
          };
        });

        delete data.keys;
      }

      return data;
    });

    return promise;
  }
});
