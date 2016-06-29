import Ember from 'ember';

export default Ember.Controller.extend({
  properties: [],

  showSpinner: false,

  spinnerMessage: 'loading ...',

  errors: [],

  clearState: function() {
    this.set('showSpinner', false);
    this.set('properties', []);
    this.set('errors', []);
  }
});
