import Ember from 'ember';
import WrapperState from '../../mixins/routes/wrapper-state';

export default Ember.Route.extend(WrapperState, {
  model(params) {
    let self = this;

    return this.explorer.getCluster(params.clusterName)
      .then(function(cluster) {
        return cluster.get('searchSchemas').findBy('name', params.searchSchemaName);
      });
  },

  afterModel(model, transition) {
    this.setSidebarCluster(model.get('cluster'));
    this.setBreadCrumbs({
      cluster: model.get('cluster'),
      searchSchema: model
    });
    this.setViewLabel({
      preLabel: 'Search Schema',
      label: model.get('name')
    });
    this.getContent(model);
  },

  getContent: function(model) {
    if (!model.get('content')) {
      return Ember.$.ajax({
        type: 'GET',
        url: model.get('url'),
        dataType: 'xml'
      }).then(function(data) {
        let xmlString = (new XMLSerializer()).serializeToString(data);
        model.set('content', xmlString);
      });
    }
  }
});
