import DS from 'ember-data';

/**
 * Represents an individual `Register` field that lives in a Riak Map data type.
 * @class RiakObjectRegister
 * @extends DS.Model
 * @constructor
 * @param name {String} Name of register field. Must end in `_register`
 * @param value {String} Value/contents of the register field.
 */
var RiakObjectRegister = DS.Model.extend({
    /**
     * Name of the register field (has to end in `_register`).
     * @property name
     * @type String
     * @readOnly
     */
    name: DS.attr('string'),

    /**
     * Convenience method to make sure that a user-provided field name
     *    ends in `_register` (as is required by the HTTP API)
     * @method normalizeName
     */
    normalizeName() {
        let name = this.get('name');
        if(!name.endsWith('_register')) {
            this.set('name', name + '_register');
        }
    },

    /**
     * Value/contents of the register field.
     *   Technically this is an Erlang 'binary' value (a byte array).
     *   However, we'll be dealing with it as a string.
     * @property value
     * @type String
     */
    value: DS.attr('string'),
});
export default RiakObjectRegister;
