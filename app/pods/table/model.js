import DS from 'ember-data';
import BucketProps from '../../mixins/models/bucket-props';
import _ from 'lodash/lodash';

/**
 * Represents a Riak TS Table
 *
 * @class Table
 * @extends DS.Model
 * @uses BucketProps
 */

var Table = DS.Model.extend(BucketProps, {
  /**
   * Riak cluster in which this Table lives.
   * @property cluster
   * @type Cluster
   * @writeOnce
   */
  cluster: DS.belongsTo('cluster'),

  fields: DS.attr(),

  localKey: DS.attr(),

  /**
   * Table name (unique per cluster),
   *    as appears on `riak-admin bucket-type list`
   * @property name
   * @type String
   */
  name: DS.attr('string'),

  partitionKey: DS.attr()
});

export default Table;
