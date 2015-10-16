import Ember from 'ember';

/**
 * Displays a list of Register type fields in a Map Data Type.
 *
 * @class ObjectContentsRegistersComponent
 * @extends Ember.Component
 * @constructor
 * @uses RiakObjectRegister
 * @uses RiakObjectMap
 */
export default Ember.Component.extend({
    explorer: Ember.inject.service('explorer'),
    store: Ember.inject.service('store'),

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
         * Creates a `RiakObjectRegister` object and adds it to this map's
         *    registers list.
         * @event addRegister
         * @param model {RiakObjectMap}
         */
        addRegister(model) {
            let value = this.get('fieldToAddValue');
            if(!value) {
                return;  // Registers must have non-empty values
            }
            let newRegister = this.get('store').createRecord(
                'riak-object.register', {
                    name: this.get('fieldToAddName'),
                    value: value
                });
            newRegister.normalizeName();
            this.get('explorer').updateDataType(model, 'addRegister',
                newRegister);
            model.addRegister(newRegister);
            // Reset the UI fields
            this.set('fieldToAddName', null);
            this.set('fieldToAddValue', null);
        },

        editRegister(model, register) {
            // Send its action to parent controller
            this.sendAction('editField', model, register);
        },

        /**
         * The user has clicked on the Delete Register button.
         * Removes the specified register from this map.
         * @event removeRegister
         * @param model {RiakObjectMap} Current map
         * @param register {RiakObjectRegister} Register to be removed
         */
        removeRegister(model, register) {
            this.get('explorer').updateDataType(model, 'removeRegister', register);
            model.removeRegister(register);
        }
    }
});
