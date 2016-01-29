import RiakObject from "../model";

/**
 * Represents a Riak Set data type. Can be used standalone, or as a field
 *    inside of a Map (`RiakObjectMap`).
 *
 * @class RiakObjectSet
 * @extends RiakObject
 * @constructor
 * @see RiakObjectMap
 * @see RiakObjectEmbeddedMap
 */
var RiakObjectSet = RiakObject.extend({
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
    return true;
  }.property(),

  /**
   * The JSON string representation of the Set contents.
   *
   * @method contentsForDisplay
   * @return {String}
   */
  contentsForDisplay: function() {
    return this.get('contents').value;
  }.property('contents')
});

export default RiakObjectSet;
