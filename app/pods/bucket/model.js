import DS from 'ember-data';
import BucketProps from '../../mixins/models/bucket-props';
import CachedListWatcher from '../../mixins/models/cached-list-watcher';

/**
 * Represents a Riak Bucket
 *
 * @class Bucket
 * @extends DS.Model
 * @extends BucketProps
 * @uses BucketType
 * @uses ObjectList
 * @uses Objects
 */
var Bucket = DS.Model.extend(BucketProps, CachedListWatcher, {
  /**
   * Riak Bucket Type in which this bucket lives.
   *
   * @property bucketType
   * @type BucketType
   * @writeOnce
   */
  bucketType: DS.belongsTo('bucket-type', {async: true}),

  /**
   * Contains the results of cached key lists for this bucket,
   * fetched from the API.
   *
   * @property key-list
   * @type objectList
   */
  objectList: DS.belongsTo('object-list', {async: true}),

  objects: DS.hasMany('riak-object', {async: true}),

  /**
   * Bucket name (unique within a cluster and bucket type)
   *
   * @property name
   * @type String
   */
  name: DS.attr('string'),

  cluster: function() {
    return this.get('bucketType').get('cluster');
  }.property('bucketType'),

  /**
   * Returns whether or not the 'Delete All Keys in Bucket' button
   *    should be displayed to the user.
   * @method allowDelete
   * @return {Boolean}
   */
  allowDelete: function() {
    return this.get('cluster').get('developmentMode') && this.get('objectList');
  }.property('cluster', 'count')
});

export default Bucket;
