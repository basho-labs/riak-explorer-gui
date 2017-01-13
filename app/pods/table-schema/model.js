import DS from 'ember-data';

export default DS.Model.extend({
  /**
   * Riak cluster the table-schema was uploaded to
   *
   * @property cluster
   * @type {DS.Model} Cluster
   * @writeOnce
   */
  cluster: DS.belongsTo('cluster'),

  name: DS.attr('string'),

  uploadUrl: function() {
    return `explore/clusters/${this.get('cluster').get('name')}/pb-messages/create/`;
  }.property('cluster')
});
