import Ember from 'ember';

export default Ember.Controller.extend({
  errors: [],

  successMessage: '',

  actions: {
    clearAlerts: function() {
      this.set('errors', []);
      this.set('successMessage', '');
    }
  }
});
