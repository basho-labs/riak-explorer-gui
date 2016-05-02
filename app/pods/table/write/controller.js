import Ember from 'ember';

export default Ember.Controller.extend({
  errors: '',

  successMessage: '',

  dataToBeInserted: '',

  isDisabled: true,

  canSubmit: function() {
    return this.set('isDisabled', Ember.isBlank(this.get('dataToBeInserted')));
  }.observes('dataToBeInserted'),

  clearErrors: function() {
    return this.set('errors', '');
  },

  clearSuccessMessage: function() {
    return this.set('successMessage', '');
  },

  clearDataToBeInserted: function() {
    return this.set('dataToBeInserted', '');
  },

  resetState: function() {
    this.clearErrors();
    this.clearSuccessMessage();
    this.clearDataToBeInserted();
  }
});
