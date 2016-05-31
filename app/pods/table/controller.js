import Ember from 'ember';
import SideDrawer from '../../mixins/controller/side-drawer';

export default Ember.Controller.extend(SideDrawer, {
  pageSize: null,

  currentTableRows: null,

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
