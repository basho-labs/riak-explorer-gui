import Ember from 'ember';

export default Ember.Controller.extend({
  dataType: 'default',

  dataTypes: ['default', 'counter', 'set', 'map'],

  properties: [],

  showSpinner: false,

  spinnerMessage: 'loading ...',

  errors: [],

  clearState: function() {
    this.set('showSpinner', false);
    this.set('dataType', 'default');
    this.set('properties', []);
    this.set('errors', []);
  },

  actions: {
    addNewProperty: function() {
      this.get('properties').pushObject({
        key: '',
        value: ''
      });
    },

    removeProperty: function(index) {
      this.get('properties').removeAt(index);
    }
  }
});
