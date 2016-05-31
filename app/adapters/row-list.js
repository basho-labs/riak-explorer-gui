import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  buildURL(modelName, id, snapshot, requestType, query) {
    // TS Tables use same end point as bucket types, differentiated by "ddl" property
    return `explore/clusters/${query.clusterName}/tables/${query.tableName}/keys`;
  },

  queryRecord(store, type, query) {
    let url = this.buildURL(type.modelName, null, null, 'query', query);

    let promise = this.ajax(url, 'GET').then(function(data) {
      if (data.keys) {
        data.rowList = data.keys;

        delete data.keys;
        delete data.rowList.keys;

        data.rowList.id = `${query.clusterName}/${query.tableName}/rowsList`;
      }

      return data;
    });

    return promise;
  }
});
