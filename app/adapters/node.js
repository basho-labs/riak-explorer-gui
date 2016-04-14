import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  buildURL(modelName, id, snapshot, requestType, query) {
    return `explore/clusters/${query.clusterName}/nodes`;
  },

  query(store, type, query) {
    let url = this.buildURL(type.modelName, null, null, 'query', query);

    let promise = this.ajax(url, 'GET').then(function(data) {
      data.nodes.forEach(function(node) {
        node.name = node.id;
        node.id = `${query.clusterName}/${node.name}`;
      });

      return data;
    });

    return promise;
  }
});
