import Ember from 'ember';

export default Ember.Controller.extend({
  pageSize: null,

  currentTableRows: null,

  helpVisibile: false,

  modalVisible: false,

  actions: {
    hideHelp: function() {
      this.set('helpVisibile', false);
    },

    showHelp: function() {
      this.set('helpVisibile', true);
    },

    hideModal: function() {
      this.set('modalVisible', false);
    },

    showModal: function() {
      this.set('modalVisible', true);
    }
  }
});
