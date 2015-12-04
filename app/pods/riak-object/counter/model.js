import DS from 'ember-data';
import RiakObject from "../model";

/**
 * Represents a Riak Counter data type. Can be used standalone, or as a field
 *    inside of a Map (`RiakObjectMap`).
 * @class RiakObjectCounter
 * @extends RiakObject
 * @constructor
 * @see RiakObjectMap
 */
var RiakObjectCounter = RiakObject.extend({
    /**
     * The amount to decrement the counter by.
     * @property decrementBy
     * @type {Number}
     * @private
     */
    decrementBy: DS.attr('integer', {defaultValue: 1}),

    /**
     * The amount to increment the counter by.
     * @property incrementBy
     * @type {Number}
     * @private
     */
    incrementBy: DS.attr('integer', {defaultValue: 1}),

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
     * The JSON string representation of the Counter value.
     * @method contentsForDisplay
     * @return {String}
     */
    contentsForDisplay: function() {
        return this.get('contents').value;
    }.property('contents'),

    /**
     * Decrements the counter by the specified amount.
     * @method decrement
     * @param {Number} amount
     * @async
     */
    decrement: function(amount) {
        var newValue = this.get('contents').value - amount;

        this.set('contents', {value: newValue});
    },

    /**
     * Increments the counter by the specified amount.
     * @method increment
     * @param {Number} amount
     * @async
     */
    increment: function(amount) {
        var newValue = this.get('contents').value + amount;

        this.set('contents', {value: newValue});
    }
});

export default RiakObjectCounter;
