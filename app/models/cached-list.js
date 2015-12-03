import DS from 'ember-data';

/**
 * Represents a key list or a bucket list that's cached on disk by Explorer API.
 *
 * @class CachedList
 * @extends DS.Model
 * @constructor
 */
var CachedList = DS.Model.extend({

    /**
     * Number of items displayed on the current page of the list
     * @property count
     * @type Number
     * @default 0
     */
    count: DS.attr('number', {defaultValue: 0}),

    /**
     * Timestamp of when the cached list was generated on the server side
     * @property created
     * @type String
     */
    created: DS.attr(),

    /**
     * Is the List operation waiting for a cache to be generated?
     * @property isLoaded
     * @type Boolean
     */
    isLoaded: DS.attr('boolean', {defaultValue: false}),

    // Total number of items in the list
    /**
     * Total number of items in the cached list
     * @property total
     * @type Number
     * @default 0
     */
    total: DS.attr('number', {defaultValue: 0})
});
export default CachedList;
