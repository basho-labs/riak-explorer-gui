import RiakObject from "../model";

/**
 * Represents a Riak Set data type. Can be used standalone, or as a field
 *    inside of a Map (`RiakObjectMap`).
 * @class RiakObjectSet
 * @extends RiakObject
 * @constructor
 * @see RiakObjectMap
 */
var RiakObjectSet = RiakObject.extend({
    /**
     * Adds a given element to the set's contents.
     * @method addElement
     * @param {String} item Element to be added
     */
    addElement: function(item) {
        if(!item) {
            return;
        }
        var set = this.get('contents').value;
        set.push(item);
        this.set('contents', {value: set});
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
     * The JSON string representation of the Set contents.
     * @method contentsForDisplay
     * @return {String}
     */
    contentsForDisplay: function() {
        return this.get('contents').value;
    }.property('contents'),

    /**
     * Removes a given element from the set's contents.
     * @method removeElement
     * @param {String} item Element to be removed
     */
    removeElement: function(item) {
        var set = this.get('contents').value;
        var index = set.indexOf(item);
        if (index > -1) {
            set.splice(index, 1);  // Remove item
        }
        this.set('contents', {value: set});
    }
});
export default RiakObjectSet;
