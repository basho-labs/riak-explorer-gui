import Ember from 'ember';

/**
 * Mixin meant for controllers to use.
 * Controls the side drawer component. Side drawer is used to show additional text and information, such as documentation.
 *
 * @module SideDrawer
 */
export default Ember.Mixin.create({
  /**
   * Sets the visibility of the side drawer
   *
   * @property isSideDrawerVisible
   * @type {Boolean}
   */
  isSideDrawerVisible: false,

  actions: {
    /**
     * Utility method to hide the side drawer
     *
     * @method hideSideDrawer
     * @public
     */
    hideSideDrawer: function() {
      this.set('isSideDrawerVisible', false);
    },

    /**
     * Utility method to show the side drawer
     *
     * @method showSideDrawer
     * @public
     */
    showSideDrawer: function() {
      this.set('isSideDrawerVisible', true);
    }
  }
});
