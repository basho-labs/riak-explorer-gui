import ObjectContentsSetComponent from "./object-contents-set";

/**
 * Displays and manages a list of all elements in an embedded Set field
 * @see RiakObjectMap
 * @see RiakObjectMapField
 *
 * @class ObjectContentsSetsEmbeddedComponent
 * @extends Ember.Component
 * @constructor
 */
var ObjectContentsSetsEmbeddedComponent = ObjectContentsSetComponent.extend({
  actions: {
    /**
     * The user has added an element to the nested Set field.
     * Forward the `addElement` action to parent controller.
     * @see ObjectContentsMapComponent
     *
     * @event addElement
     * @param setField {RiakObjectMapField}
     * @param element {String}
     */
    addElement: function(setField, element) {
      this.sendAction('addElement', setField, element);
    },

    /**
     * The user has removed an element from the nested Set field.
     * Forward the `removeElement` action to parent controller.
     *
     * @event removeElement
     * @param setField {RiakObjectMapField}
     * @param element {String}
     */
    removeElement: function(setField, element) {
      // Send its action to parent controller
      this.sendAction('removeElement', setField, element);
    },

    /**
     * The user has clicked 'Remove Set' button, to delete the field from
     * its parent map.
     * Forward the `removeField` action to parent controller.
     *
     * @event removeField
     * @param model {RiakObjectMap}
     * @param setField {RiakObjectMapField}
     */
    removeField: function(model, setField) {
      this.sendAction('removeField', model, 'set', setField);
    }
  }
});
export default ObjectContentsSetsEmbeddedComponent;
