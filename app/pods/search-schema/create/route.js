import Ember from 'ember';
import Alerts from '../../../mixins/routes/alerts';
import LoadingSlider from '../../../mixins/routes/loading-slider';
import ScrollReset from '../../../mixins/routes/scroll-reset';
import WrapperState from '../../../mixins/routes/wrapper-state';

export default Ember.Route.extend(Alerts, LoadingSlider, ScrollReset, WrapperState, {
  model(params) {
    let self = this;

    return this.explorer.getCluster(params.clusterName).then(function(cluster) {
      return self.store.createRecord('search-schema', { cluster: cluster });
    });
  },

  afterModel(model, transition) {
    this.setSidebarCluster(model.get('cluster'));
    this.setBreadCrumbs({
      cluster: model.get('cluster'),
      crudAction: 'create schema'
    });
    this.setViewLabel({
      preLabel: 'Create Schema'
    });
  },

  actions: {
    createSchema: function(clusterName, schemaName, schemaContent) {
      let self = this;
      let xmlDoc = null;

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

      this.explorer.createSchema(clusterName, schemaName, xmlDoc).then(
        function onSuccess() {
          // TODO: Need to update this to give better feedback to user on what is going on
          self.transitionTo('cluster.query', clusterName);
        },
        function onFail() {
          self.render('alerts.error-schema-not-saved', {
            into: 'application',
            outlet: 'alert'
          });
        }
      );
    }
  }
});
