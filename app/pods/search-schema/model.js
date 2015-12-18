import DS from 'ember-data';

export default DS.Model.extend({
    /**
     * Riak cluster the search schema was created on
     *
     * @property cluster
     * @type {DS.Model} Cluster
     * @writeOnce
     */
    cluster: DS.belongsTo('cluster', { async: true }),

    name: DS.attr('string'),

    content: DS.attr(),

    /**
     * Returns a formatted schema url
     * @method url
     * @returns String
     */
    url: function() {
        let proxyURL = this.get('cluster').get('proxyUrl');
        let name = this.get('name');

        return `${proxyURL}/search/schema/${name}`;
    }.property('name', 'cluster.proxyUrl')
});
