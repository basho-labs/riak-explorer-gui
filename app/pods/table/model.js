import Ember from 'ember';
import DS from 'ember-data';
import BucketProps from '../../mixins/models/bucket-props';
import CachedListWatcher from '../../mixins/models/cached-list-watcher';
import _ from 'lodash/lodash';

/**
 * Represents a Riak TS Table
 *
 * @class Table
 * @extends DS.Model
 * @uses BucketProps
 * @uses CachedListWatcher
 */
var Table = DS.Model.extend(BucketProps, CachedListWatcher, {
  /**
   * Riak cluster in which this Table lives.
   * @property cluster
   * @type Cluster
   * @writeOnce
   */
  cluster: DS.belongsTo('cluster'),

  rows: DS.hasMany('row'),

  rowsList: DS.belongsTo('row-list'),

  columns: DS.attr(),

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

  possiblePartitionKeys: function() {
    let columnNames = this.get('columns').mapBy('name');

    return columnNames.filter(function(column) {
      return Ember.isPresent(column);
    });
  }.property('partitionKey.@each.quantum'),

  possiblePartitionKeyQuantum: function() {
    return this.get('columns').filterBy('type', 'timestamp').mapBy('name');
  }.property('columns.@each.type'),

  quantumColumnName: function() {
    if (this.get('hasQuantum')) {
      let quantumColumn = _.head(this.get('partitionKey').filterBy('quantum'));
      let quantumColumnName = _.head(quantumColumn.name.replace('quantum(', '').slice(0, - 1).split(','));

      return quantumColumnName;
    }
  }.property('hasQuantum'),

  // returns first possible partition key that isn't being used already
  suggestedPartitionKey: function() {
    let possibleKeys = this.get('possiblePartitionKeys');
    let partitionKeyNames = this.get('partitionKey').mapBy('name');

    return _.head(possibleKeys.filter(function(columnName) {
      return partitionKeyNames.indexOf(columnName) === -1;
    }));
  }.property('possiblePartitionKeys', 'partitionKey.@each.name'),

  // returns first possible partition key that isn't being used already
  suggestedPartitionKeyQuantum: function() {
    let possibleKeys = this.get('possiblePartitionKeyQuantum');
    let partitionKeyNames = this.get('partitionKey').mapBy('name');

    return _.head(possibleKeys.filter(function(columnName) {
      return partitionKeyNames.indexOf(columnName) === -1;
    }));
  }.property('possiblePartitionKeyQuantum', 'partitionKey.@each.name'),

  rowsSortedByQuantumValues: function() {
    let self = this;

    if (this.get('hasQuantum')) {
      let columns = this.get('columns');
      let rows = this.get('rows');
      let quantumIndex;

      // Assign Quantum Index
      columns.forEach(function(column, index) {
        if (column.name === self.get('quantumColumnName')) {
          quantumIndex = index;
        }
      });

      // Sort rows by Quantum values
      return rows.toArray().sort(function(a, b) {
        return a.get('parsedValue')[quantumIndex] - b.get('parsedValue')[quantumIndex];
      });
    } else {
      return this.get('rows').get('parsedValue');
    }
  }.property('hasQuantum', 'rows.@each.parsedValue')
});

export default Table;
