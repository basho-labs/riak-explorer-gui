import Ember from 'ember';

export default Ember.Controller.extend({
  errors: [],

  example: `["foo", "bar", 10], ["foo", "bar", 11], ["foo", "bar", 12]`,

  writeData: '',

  helpVisibile: false,

  isDisabled: true,

  successMessage: '',

  canSubmit: function() {
    return this.set('isDisabled', Ember.isBlank(this.get('writeData')));
  }.observes('writeData'),

  clearErrors: function() {
    this.set('errors', []);
  },

  clearSuccessMessage: function() {
    this.set('successMessage', '');
  },

  clearWriteData: function() {
    this.set('writeData', '');
  },

  resetState: function() {
    this.clearErrors();
    this.clearSuccessMessage();
    this.clearWriteData();
  },

  actions: {
    removeHelp: function() {
      this.set('helpVisibile', false);
    },

    showHelp: function() {
      this.set('helpVisibile', true);
    },

    insertExample: function() {
      this.set('writeData', this.get('example'));
    }
  }
});
