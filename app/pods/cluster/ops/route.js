import ClusterRoute from '../route';
import config from '../../../config/environment';

export default ClusterRoute.extend({
  afterModel: function(model, transition) {
    this._super(model, transition);
    this.setViewLabel({
      preLabel: 'Cluster Ops',
      label: model.get('name')
    });
  },

  setupController: function(controller, model) {
    // Call _super for default behavior
    this._super(controller, model);

    let clusterName = model.get('name');

    controller.set('replBaseRoute', `${config.baseURL}control/clusters/${clusterName}`);
  }
});
