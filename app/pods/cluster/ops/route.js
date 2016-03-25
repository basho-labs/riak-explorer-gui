import ClusterRoute from '../route';

export default ClusterRoute.extend({
  afterModel: function(model, transition) {
    this._super(model, transition);
    this.setViewLabel({
      preLabel: 'Cluster Ops',
      label: model.get('name')
    });

    if (model.get('isEnterpriseEdition')) {
      this.getReplicationStatistics(model);
    }
  },

  getReplicationStatistics: function(cluster) {
    return this.explorer.getClusterReplicationStats(cluster);
  }
});
