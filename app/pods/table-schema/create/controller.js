import Ember from 'ember';

export default Ember.Controller.extend({
  errors: null,

  fileUploaded: false,

  showSpinner: false,

  validExtensions: ['proto'],

  messages: [],

  schemas: [],

  actions: {
    removeSchema: function(index) {
      return this.get('messages').removeAt(index, 1);
    },

    updateSchema(schemaIndex, newSchema) {
      return this.get('schemas').replace(schemaIndex, 1, newSchema);
    }
  }
});
