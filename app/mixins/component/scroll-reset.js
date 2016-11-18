import Ember from 'ember';

/**
 * Mixin meant for components to use.
 * Scroll reset allows the mixed-in component to easily call for a the window scroll position to go back to the top.
 *
 * @module ScrollReset
 */
export default Ember.Mixin.create({
  /**
   * Moves the window scroll position to 0 when invoked
   *
   * @method scrollToTop
   * @public
   */
  scrollToTop: function() {
    return Ember.$('.view-body').scrollTop(0);
  }
});
