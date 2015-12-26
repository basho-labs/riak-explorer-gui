import DS from 'ember-data';
import CachedList from "./cached-list";

/**
 * Represents a bucket's key list, cached by the Explorer API.
 *
 * @class KeyList
 * @extends CachedList
 * @constructor
 * @uses Bucket
 * @uses Cluster
 */
var KeyList = CachedList.extend({
  /**
   * Bucket for which this key list was generated.
   * @property bucket
   * @type Bucket
   */
  bucket: DS.attr(),

  /**
   * Cluster in which the bucket resides.
   * @property cluster
   * @type Cluster
   */
  cluster: DS.attr(),

  /**
   * List of keys (actually, RiakObject instances) for this page
   * @property keys
   * @type Array<RiakObject>
   * @default []
   */
  keys: DS.attr(null, {defaultValue: []}),

  /**
   * @method bucketId
   * @type String
   */
  bucketId: function() {
    return this.get('bucket').get('bucketId');
  }.property('bucket'),

  /**
   * @method bucketTypeId
   * @type String
   */
  bucketTypeId: function() {
    return this.get('bucket').get('bucketTypeId');
  }.property('bucket'),

  /**
   * @method clusterId
   * @type String
   */
  clusterId: function() {
    return this.get('cluster').get('clusterId');
  }.property('cluster'),

  /**
   * Returns true if this list has a nonzero key count.
   * @method hasKeys
   * @return {Boolean}
   */
  hasKeys: function() {
    return this.get('count') > 0;
  }.property('count'),

  /**
   * Returns whether or not the 'Delete All Keys in Bucket' button
   *    should be displayed to the user.
   * @method showDeleteKeys
   * @return {Boolean}
   */
  showDeleteKeys: function() {
    return this.get('cluster').get('developmentMode') &&
      this.get('hasKeys');
  }.property('cluster', 'count')
});

export default KeyList;
