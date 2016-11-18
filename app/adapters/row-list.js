import ApplicationAdapter from './application';

/**
 * @class RowListAdapter
 * @namespace Adapters
 * @extends ApplicationAdapter
 */
export default ApplicationAdapter.extend({
  /**
   * Overrides application adapter queryRecord method.
   * Used to get a tables cached row list. Please refer to cached lists in the read me for more info on explorer cached lists.
   *
   * @method queryRecord
   * @return {Object} Promise object of the requested bucket list
   */
  queryRecord(store, type, query) {
    // TS Tables use same end point as bucket types, differentiated by "ddl" property
    let url = `explore/clusters/${query.clusterName}/tables/${query.tableName}/keys`;

    let promise = this.ajax(url, 'GET').then(function(data) {
      if (data.keys) {
        data.rowList = data.keys;

        delete data.keys;
        delete data.rowList.keys;

        // Use compound key strategy to form id
        data.rowList.id = `${query.clusterName}/${query.tableName}/rowsList`;
      }

      return data;
    });

    return promise;
  }
});
