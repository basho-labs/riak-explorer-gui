import DS from 'ember-data';
import BucketProps from '../../mixins/models/bucket-props';

/**
 * Represents a Riak TS Table
 *
 * @class Table
 * @extends DS.Model
 * @uses BucketProps
 */

var BucketType = DS.Model.extend(BucketProps, {
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
  name: DS.attr('string')
});

export default BucketType;
