import DS from 'ember-data';
import CachedList from "../mixins/models/cached-list";

var ObjectList = DS.Model.extend(CachedList, {
  /**
   * The bucket type that owns this bucket list.
   * @property bucketType
   * @type BucketType
   */
  bucket: DS.belongsTo('bucket')

  /**
   * Returns true if this list has a nonzero key count.
   * @method hasKeys
   * @return {Boolean}
   */
  //hasKeys: function() {
  //  return this.get('count') > 0;
  //}.property('count'),

  /**
   * Returns whether or not the 'Delete All Keys in Bucket' button
   *    should be displayed to the user.
   * @method showDeleteKeys
   * @return {Boolean}
   */
  //showDeleteKeys: function() {
  //  return this.get('cluster').get('developmentMode') &&
  //    this.get('hasKeys');
  //}.property('cluster', 'count')
});

export default ObjectList;

