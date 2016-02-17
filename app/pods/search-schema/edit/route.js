import schemaRoute from '../route'
import Alerts from '../../../mixins/routes/alerts';

export default schemaRoute.extend(Alerts, {
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
