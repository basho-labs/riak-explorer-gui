import DS from 'ember-data';
import BucketProps from '../../mixins/models/bucket-props';

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
var BucketType = DS.Model.extend(BucketProps, {
  bucketList: DS.belongsTo('bucket-list', {async: true}),

  /**
   * Contains the results of cached bucket lists for this bucket type,
   * fetched from the API.
   * @property buckets
   * @type Bucket
   */
  buckets: DS.hasMany('bucket', {async: true}),

  /**
   * Riak cluster in which this bucket type lives.
   * @property cluster
   * @type Cluster
   * @writeOnce
   */
  cluster: DS.belongsTo('cluster', {async: true}),

  /**
   * Has the bucketList been loaded from the server?
   * @property isBucketListLoaded
   * @type Boolean
   * @default false
   */
  //isBucketListLoaded: DS.attr('boolean', {defaultValue: false}),

  /**
   * Bucket Type name (unique per cluster),
   *    as appears on `riak-admin bucket-type list`
   * @property name
   * @type String
   */
  name: DS.attr('string')
});

export default BucketType;
