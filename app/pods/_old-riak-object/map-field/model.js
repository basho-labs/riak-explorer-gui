import DS from 'ember-data';

/**
 * Represents an individual map field that lives in a Riak Map data type.
 * DS.Model name: 'riak-object.map-field'
 * @see RiakObjectMap
 *
 * @class RiakObjectMapField
 * @extends DS.Model
 * @constructor
 * @param fieldType {String} Valid Riak Map field type
 * @param name {String} Name of field. Must end in `_<field type>`
 * @param rootMap {RiakObjectMap} Top-level Map in which these fields will live
 * @param parentMap {RiakObjectMap|RiakObjectEmbeddedMap} Standalone or
 *           nested map containing these fields. When a map is nested just
 *           one level deep, the parentMap is same as rootMap. For fields
 *           nested several levels deep, the parent map will be an embedded
 *           map field.
 * @param value {Object} Value/contents of the field.
 */
var RiakObjectMapField = DS.Model.extend({
  /**
   * Field type (one of: `register`, `flag`, `map`, `counter`, `set`)
   *
   * @property fieldType
   * @type String
   * @readOnly
   */
  fieldType: DS.attr('string'),

  /**
   * Name of the map field (has to end in `_<field type>`).
   *
   * @property name
   * @type String
   * @readOnly
   */
  name: DS.attr('string'),

  /**
   * Parent map (embedded or top-level) in which this field resides.
   *
   * @property parent
   * @type (RiakObjectMap|RiakObjectMapField)
   */
  parent: DS.attr(),

  /**
   * The actual map containing these fields (this may be a Standalone top-level
   * map, or a nested map field. When a map is nested just one level deep, the
   * parentMap is same as rootMap. For fields nested several levels deep, the
   * parent map will be an embedded map field.
   *
   * @property parentMap
   * @type (RiakObjectMap|RiakObjectEmbeddedMap)
   */
  parentMap: DS.attr(),

  /**
   * Top-level standalone map in which this field lives.
   *
   * @property rootMap
   * @type RiakObjectMap
   */
  rootMap: DS.attr(),

  /**
   * Value/contents of the map field.
   * String values for Registers, boolean values for Flags,
   * arrays for Sets, numbers for Counters, and Object for Maps.
   *
   * @property value
   * @type (String|Boolean|Array|Object)
   */
  value: DS.attr(),

  /**
   * Adds an element to this nested Set field and notifies parent map
   * that contents have changed.
   *
   * @method addElement
   * @param setField {RiakObjectMapField}
   * @param newElement {String}
   */
  addElement: function(newElement) {
    if (!newElement) {
      return;
    }
    let set = this.get('value');
    if (newElement in set) {
      return;
    }
    set.push(newElement);
    this.set('value', set);
    this.get('rootMap').notifyNestedFieldChange();
  },

  /**
   * Returns the root map object's bucket.
   * Implemented as a property for compatibility in the code of
   * `ExplorerService.dataTypeActionFor`
   *
   * @property bucket
   * @type Bucket
   */
  bucket: function bucket() {
    return this.get('rootMap').get('bucket');
  }.property('rootMap'),

  fullName: function fullName() {
    if (this.get('parentMap').get('isTopLevel')) {
      return this.get('name');
    } else {
      return this.get('parentMap').get('fullName') + ' > ' + this.get('name');
    }
  }.property('name', 'parentMap'),

  /**
   * Returns the root map object's key.
   *
   * @property bucket
   * @type String
   */
  key: function key() {
    return this.get('rootMap').get('key');
  }.property('rootMap'),

  /**
   * Ensures that a user-provided field name ends in `_<field type>`
   * (as is required by the HTTP API)
   *
   * @method normalizeName
   */
  normalizeName() {
    let name = this.get('name');
    let suffix = '_' + this.get('fieldType');
    if (!name.endsWith(suffix)) {
      this.set('name', name + suffix);
    }
  },

  /**
   * Removes a given element from the nested Set field's contents and notifies
   * parent map that the field has changed.
   *
   * @method removeElement
   * @param {String} item Element to be removed
   */
  removeElement: function(item) {
    var set = this.get('value');
    var index = set.indexOf(item);
    if (index > -1) {
      set.splice(index, 1);  // Remove item
    }
    this.set('value', set);
    this.get('rootMap').notifyNestedFieldChange();
  },

  valueForDisplay: function valueForDisplay() {
    return JSON.stringify(this.get('value'));
  }.property('value')
});

export default RiakObjectMapField;
