import Ember from 'ember';

/**
 * Mixin meant for controllers to use.
 * Allows for management of the modal-dialog component (third-party plugin: see 'ember-modal-dialog' in package.json)
 *
 * @module Modal
 */
export default Ember.Mixin.create({
  /**
   * Sets the visibility of the modal
   *
   * @property modalVisible
   * @type {Boolean}
   */
  modalVisible: false,

  actions: {
    /**
     * Utility method to hide modal
     *
     * @method hideModal
     * @public
     */
    hideModal: function() {
      this.set('modalVisible', false);
    },

    /**
     * Utility method to show modal
     *
     * @method showModal
     * @public
     */
    showModal: function() {
      this.set('modalVisible', true);
    }
  }
});
