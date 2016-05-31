import Ember from 'ember';

export default Ember.Mixin.create({
  modalVisible: false,

  actions: {
    hideModal: function() {
      this.set('modalVisible', false);
    },

    showModal: function() {
      this.set('modalVisible', true);
    }
  }
});
