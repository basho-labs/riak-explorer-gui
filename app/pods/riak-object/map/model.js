import RiakObject from "../model";
import Ember from 'ember';

/**
 * Represents a Riak Map server-side Data Type.
 * This is a flexible data structure with Hashmap/Dictionary-like semantics.
 * A Map contains one or more fields, which can be of type:
 *  - Register (`*_register`, string fields with a Last-Write-Received-Wins
 *      semantics)
 *  - Flags (`*_flag`, boolean fields, Enabled-wins-over-Disabled)
 *  - Sets (`*_set`, embedded sets)
 *  - Counters (`*_counter`, embedded counters)
 *  - Maps (`*_map`, a map can contain embedded maps within itself)
 *
 * In the HTTP API, the field type is denoted by the name suffix (so, a
 * Register type field name must end in `_register`).
 *
 * @see https://docs.basho.com/riak/latest/dev/using/data-types/#Maps
 *
 * @class RiakObjectMap
 * @constructor
 * @extends RiakObject
 * @uses RiakObjectMapField
 * @uses RiakObjectEmbeddedMap
 * @param [key] {String}
 * @param [bucket] {Bucket}
 * @param [bucketType] {BucketType}
 * @param [cluster] {Cluster}
 * @param [metadata] {ObjectMetadata}
 * @param [isLoaded] {Boolean} Has this been loaded from server. Default: `false`
 * @param [rawUrl] {String}
 * @param [contents] {Object} Hashmap of map fields, by field type.
 *            Empty contents:
 *            `{ counters: {}, flags: {}, registers: {}, sets: {}, maps: {} }`
 */
var RiakObjectMap = RiakObject.extend({
    /**
     * Adds a field to the appropriate field collection for this Map.
     *
     * @method fieldType
     * @param fieldType {String} Field type ('register', 'flag' or 'counter')
     * @param field {RiakObjectMapField}
     */
    addField(fieldType, field) {
        let fieldsCollectionName = fieldType + 's';  // pluralize
        let fieldsCollection = this.get(fieldsCollectionName);  // flags, etc
        fieldsCollection[field.get('name')] = field;
        this.set(fieldsCollectionName, fieldsCollection);
        this.notifyPropertyChange('contents');
    },

    /**
     * Can this object type be edited directly, in a text box?
     *
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
     *
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
     *
     * @method contentsForDisplay
     * @return {String}
     */
    contentsForDisplay: function() {
        return JSON.stringify(this.get('contents'));
    }.property('contents'),

    /**
     * Hashmap of counters (`RiakObjectMapField` instances) for this map,
     * keyed by field name.
     *
     * @property counters
     * @type {Object}
     */
    counters: Ember.computed('contents', {
        get() {
            return this.get('contents').counters;
        },
        set(key, value) {
            var contents = this.get('contents');
            contents.counters = value;
            this.set('contents', contents);
        }
    }),

    /**
     * Returns a list of Counters for this map, sorted by field name.
     *
     * @method countersList
     * @return {Array<RiakObjectMapField>}
     */
    countersList: function countersList() {
        return this.fieldList('counters');
    }.property('counters'),

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
     * Hashmap of flags (`RiakObjectMapField` instances) for this map,
     * keyed by field name.
     *
     * @property flags
     * @type {Object}
     */
    flags: Ember.computed('contents', {
        get() {
            return this.get('contents').flags;
        },
        set(key, value) {
            var contents = this.get('contents');
            contents.flags = value;
            this.set('contents', contents);
        }
    }),

    /**
     * Returns a list of Flags for this map, sorted by field name.
     *
     * @method flagsList
     * @return {Array<RiakObjectMapField>}
     */
    flagsList: function flagsList() {
        return this.fieldList('flags');
    }.property('flags'),

    isTopLevel: function isTopLevel() {
        return true;
    }.property(),

    /**
     * Hashmap of embedded Maps (`RiakObjectEmbeddedMap` instances) in this map,
     * keyed by field name.
     *
     * @property maps
     * @type {Object}
     */
    maps: Ember.computed('contents', {
        get() {
            return this.get('contents').maps;
        },
        set(key, value) {
            var contents = this.get('contents');
            contents.maps = value;
            this.set('contents', contents);
        }
    }),

    /**
     * Returns a list of embedded Maps in this map, sorted by field name.
     *
     * @method mapsList
     * @return {Array<RiakObjectEmbeddedMap>}
     */
    mapsList: function mapsList() {
        return this.fieldList('maps');
    }.property('maps'),

    notifyNestedFieldChange() {
        this.notifyPropertyChange('contents');
    },

    /**
     * Hashmap of registers (`RiakObjectMapField` instances) for this map,
     * keyed by field name.
     *
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
     *
     * @method registersList
     * @return {Array<RiakObjectMapField>}
     */
    registersList: function registersList() {
        return this.fieldList('registers');
    }.property('registers'),


    /**
     * Adds a field to the appropriate field collection for this Map.
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
        this.notifyPropertyChange('contents');
    },

    /**
     * Hashmap of sets (`RiakObjectMapField` instances) for this map,
     * keyed by field name.
     *
     * @property sets
     * @type {Object}
     */
    sets: Ember.computed('contents', {
        get() {
            return this.get('contents').sets;
        },
        set(key, value) {
            var contents = this.get('contents');
            contents.sets = value;
            this.set('contents', contents);
        }
    }),

    /**
     * Returns a list of Sets for this map, sorted by field name.
     *
     * @method setsList
     * @return {Array<RiakObjectMapField>}
     */
    setsList: function setsList() {
        return this.fieldList('sets');
    }.property('sets')
});
export default RiakObjectMap;
