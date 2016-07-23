import Ember from 'ember';
import LoadingSlider from '../../mixins/routes/loading-slider';
import ScrollReset from '../../mixins/routes/scroll-reset';
import WrapperState from '../../mixins/routes/wrapper-state';
import _ from 'lodash/lodash';

export default Ember.Route.extend(LoadingSlider, ScrollReset, WrapperState, {
  model: function(params) {
    return this.explorer.getNode(params.clusterName, params.nodeName);
  },

  afterModel: function(model, transition) {
    this.setSidebarCluster(model.get('cluster'));
    this.setBreadCrumbs({
      cluster: model.get('cluster'),
      node: model,
      crudAction: 'stats-graphs'
    });
    this.setViewLabel({
      preLabel: 'Stats Graphs',
      label: model.get('name')
    });
  },

  setupController: function(controller, model) {
    this._super(controller, model);

    // TODO: Set available stats to be more curated
    controller.set('allAvailableStats', Object.keys(model.get('stats')));
    controller.set('currentGraphs', ['cpu_avg1']);
  }
});
