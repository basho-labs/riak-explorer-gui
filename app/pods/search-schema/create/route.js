import Ember from 'ember';
import WrapperState from '../../../mixins/routes/wrapper-state';
import Alerts from '../../../mixins/routes/alerts';

export default Ember.Route.extend(WrapperState, Alerts, {
  model(params) {
    return this.explorer.getCluster(params.clusterId);
  },

  afterModel(model, transition) {
    this.setSidebarCluster(model);
    this.setBreadCrumbs({
      cluster: model,
      schemaCreate: true
    });
    this.setViewLabel({
      preLabel: 'Create Schema'
    });
  },

  actions: {
    createSchema: function(clusterId, schemaName, schemaContent) {
      let self = this;
      let xmlDoc = null;
      let url = `/riak/clusters/${clusterId}/search/schema/${schemaName}`;

      try {
        xmlDoc = Ember.$.parseXML(schemaContent);
      } catch (error) {
        this.showAlert('alerts.error-invalid-xml');
        return;
      }

      if (!Ember.$(xmlDoc).find('schema').attr('name')) {
        this.showAlert('alerts.error-solr-must-have-name');
        return;
      }

      if (!Ember.$(xmlDoc).find('schema').attr('version')) {
        this.showAlert('alerts.error-solr-must-have-version');
        return;
      }

      return Ember.$.ajax({
        type: 'PUT',
        url: url,
        contentType: 'application/xml',
        processData: false,
        data: xmlDoc
      }).then(function(data) {
        self.transitionTo('search-schema', clusterId, schemaName);
      }, function(error) {
        self.render('alerts.error-schema-not-saved', {
          into: 'application',
          outlet: 'alert'
        });
      });
    }
  }

});
