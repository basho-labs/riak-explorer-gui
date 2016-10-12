import ApplicationAdapter from './application';
import Ember from 'ember';

/**
 * @class TableAdapter
 * @namespace Adapters
 * @extends ApplicationAdapter
 */
export default ApplicationAdapter.extend({
  /**
   * Overrides application adapter query method.
   * Used to read tables from a given cluster.
   *
   * @method query
   * @return {Object} Promise object of the requested object
   */
  query(store, type, query) {
    // TS Tables use same end point as bucket types, differentiated by "ddl" property
    let url = `explore/clusters/${query.clusterName}/bucket_types`;

    let promise = this.ajax(url, 'GET').then(function(data) {

      // Remove any kv bucket types, they are added by the BucketTypeAdapter.
      // Time series tables are identified by the "ddl" property.
      data.tables = data.bucket_types.filter(function(bt) {
        return Ember.isPresent(bt.props.ddl);
      });

      delete data.bucket_types;

      // Use compound key strategy to form name/id
      data.tables.forEach(function(table) {
        table.name = table.id;
        table.id = `${query.clusterName}/${table.name}`;
      });

      return data;
    });

    return promise;
  }
});
