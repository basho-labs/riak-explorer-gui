import DS from 'ember-data';
import Ember from "ember";

var SearchIndexAdapter = DS.RESTAdapter.extend({
    buildURL(modelName, id, snapshot, requestType, query) {
        return `/riak/clusters/${query.clusterId}/search/index`;
    },

    query(store, type, query) {
        let url = this.buildURL(type.modelName, null, null, 'query', query);

        let promise = this.ajax(url, 'GET').then(function(indexes) {

            indexes.forEach(function(index) {
                index.id = `${query.clusterId}/${index.name}`;
            });

            return indexes;
        });

        return promise;
    }
});

export default SearchIndexAdapter;
