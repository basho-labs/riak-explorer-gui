import Ember from 'ember';
import $ from 'jquery';

export default Ember.Route.extend({
    model(params) {
        return this.explorer.getCluster(params.clusterId, this.store)
            .then(function(cluster){
                return cluster.get('searchSchemas').findBy('name', params.searchSchemaId);
            });
    },

    // TODO: Move to init???
    afterModel(model, transition) {
        return Ember.$.ajax({
            type: 'GET',
            url: model.get('url'),
            dataType: 'xml'
        }).then(function(data) {
            let xmlString = (new XMLSerializer()).serializeToString(data);
            model.set('content', xmlString);
        });
    }
});
