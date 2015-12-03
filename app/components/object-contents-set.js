import Ember from 'ember';

/**
 * Displays and manages a list of all elements in a Riak server-side Set.
 * @see RiakObjectSet
 *
 * @class ObjectContentsSetComponent
 * @extends Ember.Component
 * @constructor
 */
var ObjectContentsSetComponent = Ember.Component.extend({
    actions: {
        /**
         * The user has added an element to the Set.
         * Forward the `addElement` action to parent controller.
         * @see RiakObjectSetController
         *
         * @event addElement
         * @param set {RiakObjectSet}
         * @param element {String}
         */
        addElement: function(set, element) {
            this.sendAction('addElement', set, element);
        },

        /**
         * The user has clicked the Delete Set (deletes the whole set object)
         * Forward the `deleteObject` action to parent controller.
         * @see RiakObjectSetController
         *
         * @event deleteObject
         * @param object {RiakObjectSet}
         */
        deleteObject: function(object) {
            // Send action to parent controller
            this.sendAction('deleteObject', object);
        },

        /**
         * The user has removed an element from the Set.
         * Forward the `removeElement` action to parent controller.
         * @see RiakObjectSetController
         *
         * @event removeElement
         * @param set {RiakObjectSet}
         * @param element {String}
         */
        removeElement: function(set, element) {
            // Send its action to parent controller
            this.sendAction('removeElement', set, element);
        }
    }
});
export default ObjectContentsSetComponent;
