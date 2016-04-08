import DS from 'ember-data';
import BucketProps from '../../mixins/models/bucket-props';
import CachedListWatcher from '../../mixins/models/cached-list-watcher';

/**
 * Represents a Riak Bucket Type
 *
 * @class BucketType
 * @extends DS.Model
 * @constructor
 * @uses Cluster
 * @uses BucketProps
 * @uses BucketList
 */
var BucketType = DS.Model.extend(BucketProps, CachedListWatcher, {
  bucketList: DS.belongsTo('bucket-list'),

  /**
   * Contains the results of cached bucket lists for this bucket type,
   * fetched from the API.
   * @property buckets
   * @type Bucket
   */
  buckets: DS.hasMany('bucket'),

  /**
   * Riak cluster in which this bucket type lives.
   * @property cluster
   * @type Cluster
   * @writeOnce
   */
  cluster: DS.belongsTo('cluster'),

  /**
   * Bucket Type name (unique per cluster),
   *    as appears on `riak-admin bucket-type list`
   * @property name
   * @type String
   */
  name: DS.attr('string'),

  
  alerts: DS.attr()
});

export default BucketType;
