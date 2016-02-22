import DS from 'ember-data';
import CachedList from "../mixins/models/cached-list";

/**
 * Represents a list of buckets in the current bucket type,
 * cached by the Explorer API.
 *
 * @class BucketList
 * @extends CachedList
 * @uses BucketType
 */
var BucketList = DS.Model.extend(CachedList, {
  /**
   * The bucket type that owns this bucket list.
   * @property bucketType
   * @type BucketType
   */
  bucketType: DS.belongsTo('bucket-type')
});

export default BucketList;
