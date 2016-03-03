import Ember from 'ember';
import schemaRoute from '../route';
import Alerts from '../../../mixins/routes/alerts';
import ScrollReset from '../../../mixins/routes/scroll-reset';

export default schemaRoute.extend(Alerts, ScrollReset, {
  afterModel(model, transition) {
    this.simulateLoad();

    return this._super(model, transition);
  },

  actions: {
    updateSchema: function(schema) {
      let xmlString = schema.get('content');
      let xmlDoc = null;
      let clusterName = schema.get('cluster').get('name');
      let schemaName = schema.get('name');
      let self = this;

      try {
        xmlDoc = Ember.$.parseXML(xmlString);
      } catch (error) {
        this.render('alerts._error_old-invalid-xml', {
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
          self.showAlert('alerts._error_old-schema-not-saved');
        }
      );
    }
  }
});
