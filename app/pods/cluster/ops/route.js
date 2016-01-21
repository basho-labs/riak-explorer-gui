import ClusterRoute from '../route';

export default ClusterRoute.extend({
  afterModel: function(model, transition) {
    this._super(model, transition);
    this.setViewLabel({
      preLabel: 'Cluster Ops',
      label: model.get('id')
    });
  }
});
