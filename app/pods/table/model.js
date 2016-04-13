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

  partitionKey: DS.attr(),

  quantum: DS.attr('string'),

  familyField: function() {
    let fields = this.get('fields');
    let familyField = null;

    Object.keys(fields).forEach(function(key) {
      if (fields[key].position === 1) {
        familyField = _.extend({name: key}, fields[key]);
      }
    });

    return familyField;
  }.property('fields'),

  seriesField: function() {
    let fields = this.get('fields');
    let seriesField = null;

    Object.keys(fields).forEach(function(key) {
      if (fields[key].position === 2) {
        seriesField = _.extend({name: key}, fields[key]);
      }
    });

    return seriesField;
  }.property('fields'),

  quantumField: function() {
    let quantumField = null;
    let fields = this.get('fields');
    let quantumString = this.get('quantum');
    // Removes parenthesis, splits on comma into array, and grabs first item
    let quantumFieldName = quantumString.replace(/[()]/g, '').split(',')[0];

    quantumField = _.extend({name: quantumFieldName}, fields[quantumFieldName]);

    return quantumField;
  }.property('fields'),

  stringifiedFields: function() {
    return JSON.stringify(this.get('fields'), null, ' ');
  }.property('fields')
});

export default Table;
