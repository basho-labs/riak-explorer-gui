import RiakObject from "../model";
import Ember from 'ember';

/**
 * Represents a Riak Map Data Type.
 *
 * @class RiakObjectMap
 * @constructor
 * @extends RiakObject
 * @uses RiakObjectRegister
 * @uses RiakObjectCounter
 * @uses RiakObjectSet
 * @uses RiakObjectFlag
 */
var RiakObjectMap = RiakObject.extend({
    /**
     * Adds a register to this Map.
     * @method addRegister
     * @param {RiakObjectRegister} field
     */
    addRegister: function addRegister(field) {
        let registers = this.get('registers');
        registers[field.get('name')] = field;
        this.set('registers', registers);
        this.notifyPropertyChange('contents');
    },

    /**
     * Can this object type be edited directly, in a text box?
     * @property canBeEdited
     * @readOnly
     * @default false
     * @type {Boolean}
     */
    canBeEdited: function() {
        return false;
    }.property(),

    /**
     * Can this object be viewed/downloaded directly from the browser?
     * @property canBeViewedRaw
     * @readOnly
     * @default false
     * @type {Boolean}
     */
    canBeViewedRaw: function() {
        return false;
    }.property(),

    /**
     * The JSON string representation of the Map contents.
     * @method contentsForDisplay
     * @return {String}
     */
    contentsForDisplay: function() {
        return JSON.stringify(this.get('contents'));
    }.property('contents'),

    /**
     * Hash table of registers (`RiakObjectRegister` instances) for this map,
     *     keyed by field name.
     * @property registers
     * @type {Object}
     */
    registers: Ember.computed('contents', {
        get() {
            return this.get('contents').registers;
        },
        set(key, value) {
            var contents = this.get('contents');
            contents.registers = value;
            this.set('contents', contents);
        }
    }),

    /**
     * Returns a list of Registers for this map, sorted by field name.
     * @method registersList
     * @return {Array}
     */
    registersList: function registersList() {
        var list = [];
        var registers = this.get('registers');
        for(var fieldName in registers) {
            list.push(registers[fieldName]);
        }
        return list.sortBy('name');
    }.property('registers'),

    /**
     * Removes (deletes) a register from this Map.
     * @method removeRegister
     * @param {RiakObjectRegister} field
     */
    removeRegister: function removeRegister(field) {
        var registers = this.get('registers');
        if(field.get('name') in registers) {
            delete registers[field.get('name')];
        }
        this.set('registers', registers);
        this.notifyPropertyChange('contents');
    }
});
export default RiakObjectMap;
