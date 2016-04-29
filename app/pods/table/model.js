import Ember from 'ember';
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

  hasQuantum: function() {
    return Ember.isPresent(this.get('partitionKey').filterBy('quantum'));
  }.property('partitionKey.@each.quantum'),

  quantumFieldName: function() {
    if (this.get('hasQuantum')) {
      let quantumField = _.head(this.get('partitionKey').filterBy('quantum'));
      let quantumFieldName = _.head(quantumField.name.replace('quantum(', '').slice(0, - 1).split(','));

      return quantumFieldName;
    }
  }.property('hasQuantum'),

  possiblePartitionKeys: function() {
    let fieldNames = this.get('fields').mapBy('name');

    return fieldNames.filter(function(field) {
      return Ember.isPresent(field);
    });
  }.property('partitionKey.@each.quantum'),

  possiblePartitionKeyQuantum: function() {
    return this.get('fields').filterBy('type', 'timestamp').mapBy('name');
  }.property('fields.@each.type'),

  // returns first possible partition key that isn't being used already
  suggestedPartitionKey: function() {
    let possibleKeys = this.get('possiblePartitionKeys');
    let partitionKeyNames = this.get('partitionKey').mapBy('name');

    return _.head(possibleKeys.filter(function(fieldName) {
      return partitionKeyNames.indexOf(fieldName) === -1;
    }));
  }.property('possiblePartitionKeys', 'partitionKey.@each.name'),

  // returns first possible partition key that isn't being used already
  suggestedPartitionKeyQuantum: function() {
    let possibleKeys = this.get('possiblePartitionKeyQuantum');
    let partitionKeyNames = this.get('partitionKey').mapBy('name');

    return _.head(possibleKeys.filter(function(fieldName) {
      return partitionKeyNames.indexOf(fieldName) === -1;
    }));
  }.property('possiblePartitionKeyQuantum', 'partitionKey.@each.name')
});

export default Table;
