import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return this.explorer.getCluster(params.clusterId, this.store);
  },

  actions: {
    createSchema: function(clusterId, schemaName, schemaContent) {
      let self = this;
      let xmlDoc = null;
      let url = `/riak/clusters/${clusterId}/search/schema/${schemaName}`;

      try {
        xmlDoc = Ember.$.parseXML(schemaContent);
      } catch (error) {
        // TODO: Put in proper error messaging
        alert('Invalid XML. Please check and make sure schema is valid xml.');
        return;
      }

      if (!Ember.$(xmlDoc).find('schema').attr('name')) {
        // TODO: Put in proper error messaging
        alert('Solr requires that the schema tag has a name attribute. Please update your xml.');
        return;
      }

      if (!Ember.$(xmlDoc).find('schema').attr('version')) {
        // TODO: Put in proper error messaging
        alert('Solr requires that the schema tag has a version attribute. Please update your xml.');
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
        // TODO: Put in proper error messaging
        alert('Something went wrong, schema was not saved.');
      });
    }
  }

});
