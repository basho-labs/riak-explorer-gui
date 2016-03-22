import Ember from 'ember';

export default Ember.Controller.extend({
  bucketTypeName: '',

  dataType: 'default',

  dataTypes: ['default', 'counter', 'set', 'map'],

  properties: [],

  errors: [],

  clearState: function() {
    this.set('bucketTypeName', '');
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
