import Ember from 'ember';

export default Ember.Mixin.create({
  isSideDrawerVisible: false,

  actions: {
    hideSideDrawer: function() {
      this.set('isSideDrawerVisible', false);
    },

    showSideDrawer: function() {
      this.set('isSideDrawerVisible', true);
    }
  }
});
