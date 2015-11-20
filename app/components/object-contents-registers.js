import Ember from 'ember';

/**
 * Displays a list of Register type fields in a Map Data Type.
 *
 * @class ObjectContentsRegistersComponent
 * @extends Ember.Component
 * @constructor
 */
var ObjectContentsRegistersComponent = Ember.Component.extend({
    /**
     * @property fieldToAddName
     * @type {String}
     */
    fieldToAddName: null,

    /**
     * @property fieldToAddValue
     * @type {String}
     */
    fieldToAddValue: null,

    actions: {
        /**
         * The user has clicked on the 'Add Register' button.
         * Forward the `addField` action to parent controller:
         * @see ObjectContentsMapComponent
         *
         * @event addField
         * @param model {RiakObjectMap}
         */
        addField(model) {
            let newName = this.get('fieldToAddName');
            let newValue = this.get('fieldToAddValue');
            if(!newName || !newValue) {
                return;  // Registers must have non-empty names and values
            }
            this.sendAction('addField', model, 'register', newName, newValue);

            // Reset the UI fields
            this.set('fieldToAddName', null);
            this.set('fieldToAddValue', null);
        },

        /**
         * The user has clicked on the Edit Register button.
         * Forward the `editRegister` action to parent controller.
         *
         * @event editField
         * @param model {RiakObjectMap} Current map
         * @param register {RiakObjectMapField} Register to be removed
         */
        editField(model, register) {
            this.sendAction('editField', model, 'register', register);
        },

        /**
         * The user has clicked on the Delete Register button.
         * Forward the `removeField` action to parent controller.
         *
         * @event removeField
         * @param model {RiakObjectMap} Current map
         * @param register {RiakObjectMapField} Register to be removed
         */
        removeField(model, register) {
            this.sendAction('removeField', model, 'register', register);
        }
    }
});
export default ObjectContentsRegistersComponent;
