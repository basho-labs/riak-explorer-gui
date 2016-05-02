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
  },

  actions: {
    removeHelp: function() {
      return this.set('helpVisibile', false);
    },

    showHelp: function() {
      return this.set('helpVisibile', true);
    },

    insertExample: function() {
      return this.set('dataToBeInserted', this.get('example'));
    }
  }
});
