import schemaRoute from '../route'
import Alerts from '../../../mixins/routes/alerts';

export default schemaRoute.extend(Alerts, {
  actions: {
    updateSchema: function(schema) {
      let xmlString = schema.get('content');
      let self = this;
      let xmlDoc = null;
      let clusterName = schema.get('cluster').get('name');
      let schemaName = schema.get('name');

      try {
        xmlDoc = Ember.$.parseXML(xmlString);
      } catch (error) {
        this.render('alerts.error-invalid-xml', {
          into: 'application',
          outlet: 'alert'
        });

        return;
      }

      return Ember.$.ajax({
        type: 'PUT',
        url: schema.get('url'),
        contentType: 'application/xml',
        processData: false,
        data: xmlDoc
      }).then(function(data) {
        self.transitionTo('search-schema', clusterName, schemaName);
      }, function(error) {
        self.showAlert('alerts.error-schema-not-saved');
      });
    }
  }
});
