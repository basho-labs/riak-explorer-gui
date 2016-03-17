import Ember from 'ember';
import schemaRoute from '../route';
import Alerts from '../../../mixins/routes/alerts';
import ScrollReset from '../../../mixins/routes/scroll-reset';

export default schemaRoute.extend(Alerts, ScrollReset, {
  afterModel(model, transition) {
    this.simulateLoad();

    return this._super(model, transition);
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
