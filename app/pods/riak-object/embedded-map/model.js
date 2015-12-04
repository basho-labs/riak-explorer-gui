import Ember from 'ember';
import RiakObjectMapField from "../map-field/model";

/**
 * Represents a nested map field that lives in a standalone Riak Map data type.
 * Implements much of the field management API of a standalone `RiakObjectMap`.
 * @see RiakObjectMap
 * DS.Model name: 'riak-object.embedded-map'
 *
 * @class RiakObjectEmbeddedMap
 * @extends RiakObjectMapField
 * @constructor
 * @param fieldType {String} Valid Riak Map field type (must be 'map')
 * @param name {String} Name of nested map. Must end in `_map`
 * @param rootMap {RiakObjectMap} Top-level Map in which these fields will live
 * @param parentMap {RiakObjectMap|RiakObjectEmbeddedMap} Standalone or
 *           nested map containing these fields. When a map is nested just
 *           one level deep, the parentMap is same as rootMap. For fields
 *           nested several levels deep, the parent map will be an embedded
 *           map field.
 * @param value {Object} Hashmap of nested map fields, by field type.
 *            Empty value:
 *            `{ counters: {}, flags: {}, registers: {}, sets: {}, maps: {} }`
 */
var RiakObjectEmbeddedMap = RiakObjectMapField.extend({

    /**
     * Adds a field to the appropriate field collection for this nested Map field.
     *
     * @method fieldType
     * @param fieldType {String} Field type ('register', 'flag' or 'counter')
     * @param field {RiakObjectMapField|RiakObjectEmbeddedMap}
     */
    addField(fieldType, field) {
        let fieldsCollectionName = fieldType + 's';  // pluralize
        let fieldsCollection = this.get(fieldsCollectionName);  // flags, etc
        fieldsCollection[field.get('name')] = field;
        this.set(fieldsCollectionName, fieldsCollection);
        this.notifyPropertyChange('value');
        this.get('rootMap').notifyNestedFieldChange();
    },

    /**
     * Returns a list of Counters for this map, sorted by field name.
     *
     * @method countersList
     * @return {Array<RiakObjectMapField>}
     */
    countersList: function countersList() {
        return this.fieldList('counters');
    }.property('counters'),

    isTopLevel: function isTopLevel() {
        return false;
    }.property(),

    /**
     * Returns a list of a given field type for this map, sorted by field name.
     *
     * @method fieldList
     * @param fieldsCollectionName {String} Field type plural (registers, flags,
     *                                      sets, maps, counters)
     * @return {Array<RiakObjectMapField>} List of field instances of the given type
     */
    fieldList: function fieldList(fieldsCollectionName) {
        var list = [];
        var fields = this.get(fieldsCollectionName);
        for(var fieldName in fields) {
            list.push(fields[fieldName]);
        }
        return list.sortBy('name');
    },

    /**
     * Returns a list of Flags for this map, sorted by field name.
     *
     * @method flagsList
     * @return {Array<RiakObjectMapField>}
     */
    flagsList: function flagsList() {
        return this.fieldList('flags');
    }.property('flags'),

    /**
     * Returns a list of embedded Maps in this map, sorted by field name.
     *
     * @method mapsList
     * @return {Array<RiakObjectEmbeddedMap>}
     */
    mapsList: function mapsList() {
        return this.fieldList('maps');
    }.property('maps'),

    /**
     * Returns a list of Registers for this map, sorted by field name.
     *
     * @method registersList
     * @return {Array<RiakObjectMapField>}
     */
    registersList: function registersList() {
        return this.fieldList('registers');
    }.property('registers'),

    /**
     * Adds a field to the appropriate field collection for this nested map field.
     *
     * @method removeField
     * @param fieldType {String} Field type
     *        ('register', 'flag', 'counter', 'set' or 'map')
     * @param field {RiakObjectMapField|RiakObjectEmbeddedMap}
     */
    removeField(fieldType, field) {
        let fieldsCollectionName = fieldType + 's';  // pluralize
        let fieldsCollection = this.get(fieldsCollectionName);  // flags, etc
        if(field.get('name') in fieldsCollection) {
            delete fieldsCollection[field.get('name')];
        }
        this.set(fieldsCollectionName, fieldsCollection);
        this.notifyPropertyChange('value');
        this.get('rootMap').notifyNestedFieldChange();
    },

    /**
     * Returns a list of Sets for this map, sorted by field name.
     *
     * @method setsList
     * @return {Array<RiakObjectMapField>}
     */
    setsList: function setsList() {
        return this.fieldList('sets');
    }.property('sets'),

    /**
     * Hashmap of counters (`RiakObjectMapField` instances) for this map,
     * keyed by field name.
     *
     * @property counters
     * @type {Object}
     */
    counters: Ember.computed('value', {
        get() {
            return this.get('value').counters;
        },
        set(key, val) {
            var contents = this.get('value');
            contents.counters = val;
            this.set('value', contents);
        }
    }),

    /**
     * Hashmap of flags (`RiakObjectMapField` instances) for this map,
     * keyed by field name.
     *
     * @property flags
     * @type {Object}
     */
    flags: Ember.computed('value', {
        get() {
            return this.get('value').flags;
        },
        set(key, val) {
            var contents = this.get('value');
            contents.flags = val;
            this.set('value', contents);
        }
    }),

    /**
     * Hashmap of embedded Maps (`RiakObjectEmbeddedMap` instances) in this map,
     * keyed by field name.
     *
     * @property maps
     * @type {Object}
     */
    maps: Ember.computed('value', {
        get() {
            return this.get('value').maps;
        },
        set(key, val) {
            var contents = this.get('value');
            contents.maps = val;
            this.set('value', contents);
        }
    }),

    /**
     * Hashmap of registers (`RiakObjectMapField` instances) for this map,
     * keyed by field name.
     *
     * @property registers
     * @type {Object}
     */
    registers: Ember.computed('value', {
        get() {
            return this.get('value').registers;
        },
        set(key, val) {
            var contents = this.get('value');
            contents.registers = val;
            this.set('value', contents);
        }
    }),

    /**
     * Hashmap of sets (`RiakObjectMapField` instances) for this map,
     * keyed by field name.
     *
     * @property sets
     * @type {Object}
     */
    sets: Ember.computed('value', {
        get() {
            return this.get('value').sets;
        },
        set(key, val) {
            var contents = this.get('value');
            contents.sets = val;
            this.set('value', contents);
        }
    })
});

export default RiakObjectEmbeddedMap;
