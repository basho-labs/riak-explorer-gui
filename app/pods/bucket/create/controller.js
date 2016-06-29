import Ember from 'ember';

export default Ember.Controller.extend({
  properties: [],

  showSpinner: false,

  spinnerMessage: 'loading ...',

  errors: [],

  object: {
    key: '',
    value: '',
    contentType: 'application/json',
    type: null
  },

  clearState: function() {
    this.set('showSpinner', false);
    this.set('properties', []);
    this.set('errors', []);
  },

  actions: {
    createBucketType: function() {
      alert('button clicked');
    }
  }
});
