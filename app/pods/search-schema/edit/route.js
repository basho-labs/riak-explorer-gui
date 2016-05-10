import Ember from 'ember';
import Alerts from '../../../mixins/routes/alerts';
import LoadingSlider from '../../../mixins/routes/loading-slider';
import ScrollReset from '../../../mixins/routes/scroll-reset';
import WrapperState from '../../../mixins/routes/wrapper-state';

export default Ember.Route.extend(Alerts, LoadingSlider, ScrollReset, WrapperState, {
  model(params) {
    return this.explorer.getSearchSchema(params.clusterName, params.searchSchemaName);
  },

  afterModel(model, transition) {
    this.setSidebarCluster(model.get('cluster'));
    this.setBreadCrumbs({
      cluster: model.get('cluster'),
      searchSchema: model,
      crudAction: 'edit'
    });
    this.setViewLabel({
      preLabel: 'Search Schema',
      label: model.get('name')
    });

    this.simulateLoad();
  },

  setupController (controller, model) {
    this._super(controller, model);
    let currentContent = model.get('content');

    controller.set('editableContent', currentContent);
  },

  actions: {
    updateSchema: function(schema) {
      let xmlString = this.controller.get('editableContent');
      let xmlDoc = null;
      let clusterName = schema.get('cluster').get('name');
      let schemaName = schema.get('name');
      let self = this;

      try {
        xmlDoc = Ember.$.parseXML(xmlString);
      } catch (error) {
        this.render('alerts.error-invalid-xml', {
          into: 'application',
          outlet: 'alert'
        });

        return;
      }

      this.explorer.updateSchema(schema, xmlDoc).then(
        function onSuccess() {
          self.transitionTo('search-schema', clusterName, schemaName);
        },
        function onFail() {
          self.showAlert('alerts.error-schema-not-saved');
        }
      );
    }
  }
});
