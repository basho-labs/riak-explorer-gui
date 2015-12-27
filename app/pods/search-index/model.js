import DS from 'ember-data';

var SearchIndex = DS.Model.extend({
  /**
   * Riak cluster the search index was created on
   *
   * @property cluster
   * @type {DS.Model} Cluster
   * @writeOnce
   */
  cluster: DS.belongsTo('cluster', {async: true}),

  /**
   * Schema the search index is using
   *
   * @property schema
   * @type {DS.Model} Search Schema
   * @writeOnce
   */
  schema: DS.belongsTo('search-schema', {async: true}),

  /**
   * Returns the search index name/id
   * @property name
   * @type String
   */
  name: DS.attr('string'),

  /**
   * Returns the search index n value
   * @property nVal
   * @type Integer
   */
  nVal: DS.attr('number', {defaultValue: 3}),

  /**
   * Holds the value of the schema name that index is using.
   *  Temporary hack until basho-labs/riak_explorer#89 is completed
   * @property nVal
   * @type Integer
   */
  schemaRef: DS.attr('string'),

  /**
   * Ember.Array of bucket types on the current cluster using the index
   * @property bucketTypesUsing
   * @type {Ember.Array} bucketTypes
   */
  bucketTypesUsing: function() {
    let bucketTypes = this.get('cluster').get('bucketTypes');

    return bucketTypes.filterBy('index.name', this.get('name'));
  }.property('cluster.bucketTypes')
});

export default SearchIndex;
