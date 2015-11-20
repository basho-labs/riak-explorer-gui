import DS from 'ember-data';

/**
 * Represents an individual `Flag` field that lives in a Riak Map data type.
 * @see RiakObjectMap
 *
 * @class RiakObjectFlag
 * @extends DS.Model
 * @constructor
 * @param name {String} Name of flag field. Must end in `flag`
 * @param value {Boolean} Flag value (enabled/disabled)
 */
var RiakObjectFlag = DS.Model.extend({
    /**
     * Name of the flag field (has to end in `flag`).
     *
     * @property name
     * @type String
     * @readOnly
     */
    name: DS.attr('string'),

    /**
     * Convenience method to make sure that a user-provided field name
     *    ends in `flag` (as is required by the HTTP API)
     *
     * @method normalizeName
     */
    normalizeName() {
        let name = this.get('name');
        if(!name.endsWith('_flag')) {
            this.set('name', name + '_flag');
        }
    },

    /**
     * Flag value (enabled/disabled)
     *
     * @property value
     * @type Boolean
     */
    value: DS.attr('boolean'),
});
export default RiakObjectFlag;
