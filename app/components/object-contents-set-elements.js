import Ember from 'ember';

/**
 * Displays and manages a set's elements (either a Set field embedded in a Map,
 * or a standalone Set object).
 * @see RiakObjectSet
 * @see RiakObjectMapField
 *
 * @class ObjectContentsSetElementsComponent
 * @extends Ember.Component
 * @constructor
 */
var ObjectContentsSetElementsComponent = Ember.Component.extend({
  elementToAdd: null,

  actions: {
    /**
     * The user has added an element to the Set.
     * Forward the `addElement` action to parent controller, which is
     * one of:
     * @see ObjectContentsSetComponent
     * @see ObjectContentsSetsEmbeddedComponent
     *
     * @event addElement
     * @param set {RiakObjectSet|RiakObjectMapField}
     */
    addElement: function(set) {
      this.sendAction('addElement', set, this.get('elementToAdd'));
      this.set('elementToAdd', null);  // Reset text box
    },

    deleteObject: function(object) {
      // Send action to parent controller
      this.sendAction('deleteObject', object);
    },

    /**
     * The user has removed an element to the Set.
     * Forward the `removeElement` action to parent controller, which is
     * one of:
     * @see ObjectContentsSetComponent
     * @see ObjectContentsSetsEmbeddedComponent
     *
     * @event removeElement
     * @param set {RiakObjectSet|RiakObjectMapField}
     * @param element {String}
     */
    removeElement: function(set, element) {
      this.sendAction('removeElement', set, element);
    }
  }
});
export default ObjectContentsSetElementsComponent;
