import Ember from 'ember';
import SideBarSelect from '../../mixins/sidebar-select';

export default Ember.Route.extend(SideBarSelect, {
  model(params) {
    let self = this;

    return this.explorer.getCluster(params.clusterId)
      .then(function(cluster) {
        let schema = cluster.get('searchSchemas').findBy('name', params.searchSchemaId);

        if (!schema) {
          schema = self.explorer.createSchema(params.searchSchemaId, cluster);
        }

        return schema;
      });
  },

  afterModel(model, transition) {
    this.setSidebarCluster(model.get('cluster'));

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
