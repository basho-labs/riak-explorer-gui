import DS from 'ember-data';

var SearchIndex = DS.Model.extend({
    /**
     * Riak cluster in the search index wascreated on
     *
     * @property cluster
     * @type {DS.Model} Cluster
     * @writeOnce
     */
    cluster: DS.belongsTo('cluster'),

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
     * Name of the schema the index is using
     * @property schema
     * @type String
     */
    schema: DS.attr('string'),

    /**
     * Ember.Array of bucket types on the current cluster using the index
     * @property bucketTypesUsing
     * @type {Ember.Array} bucketTypes
     */
    bucketTypesUsing: function() {
        let bucketTypes = this.get('cluster').get('bucketTypes');

        return bucketTypes.filterBy('index.name', this.get('name'));
    }.property('cluster.bucketTypes'),

    /**
     * Returns a formatted schema url
     * @property schemaUrl
     * @type String
     */
    schemaUrl: function() {
        let proxyURL = this.get('cluster').get('proxyUrl');
        let schema = this.get('schema');

        return `${proxyURL}/search/schema/${schema}`;
    }.property('schema', 'cluster.proxyUrl')
});

export default SearchIndex;
