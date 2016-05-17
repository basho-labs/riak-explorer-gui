import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  buildURL(modelName, id, snapshot, requestType, query) {
    // TS Tables use same end point as bucket types, differentiated by "ddl" property
    return `explore/clusters/${query.clusterName}/tables/${query.tableName}/keys`;
  },

  query(store, type, query) {
    let url = this.buildURL(type.modelName, null, null, 'query', query);

    let promise = this.ajax(url, 'GET').then(function(data) {
      if (data.keys && data.keys.keys) {
        data.rows = data.keys.keys.map(function(rowValue, index) {
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
