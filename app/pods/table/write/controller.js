import Ember from 'ember';

export default Ember.Controller.extend({
  errors: '',

  example: `["foo", "bar", 10], ["foo", "bar", 11], ["foo", "bar", 12]`,

  dataToBeInserted: '',

  helpVisibile: false,

  isDisabled: true,

  successMessage: '',

  canSubmit: function() {
    return this.set('isDisabled', Ember.isBlank(this.get('dataToBeInserted')));
  }.observes('dataToBeInserted'),

  clearErrors: function() {
    this.set('errors', '');
  },

  clearSuccessMessage: function() {
    this.set('successMessage', '');
  },

  clearDataToBeInserted: function() {
    this.set('dataToBeInserted', '');
  },

  resetState: function() {
    this.clearErrors();
    this.clearSuccessMessage();
    this.clearDataToBeInserted();
  },

  actions: {
    removeHelp: function() {
      this.set('helpVisibile', false);
    },

    showHelp: function() {
      this.set('helpVisibile', true);
    },

    insertExample: function() {
      this.set('dataToBeInserted', this.get('example'));
    }
  }
});
