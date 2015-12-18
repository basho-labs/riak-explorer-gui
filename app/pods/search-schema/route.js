import Ember from 'ember';
import $ from 'jquery';

export default Ember.Route.extend({
    model(params) {
        let self = this;

        return this.explorer.getCluster(params.clusterId, this.store)
            .then(function(cluster){
                let schema = cluster.get('searchSchemas').findBy('name', params.searchSchemaId);

                if (!schema) {
                    schema = self.explorer.createSchema(params.searchSchemaId, cluster, self.store);
                }

                return schema;
            });
    },

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
