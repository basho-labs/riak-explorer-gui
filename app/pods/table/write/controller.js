import Ember from 'ember';
import SideDrawer from '../../../mixins/controller/side-drawer';

export default Ember.Controller.extend(SideDrawer, {
  errors: [],

  example: '',

  writeData: '',

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
    insertExample: function() {
      this.set('writeData', this.get('example'));
    }
  }
});
