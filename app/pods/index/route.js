import Ember from 'ember';
import LoadingSlider from '../../mixins/routes/loading-slider';
import ScrollReset from '../../mixins/routes/scroll-reset';

export default Ember.Route.extend(LoadingSlider, ScrollReset, {
  afterModel: function(clusters, transition) {
    // If only one cluster, go ahead and go straight to it
    if (clusters.get('length') === 1) {
      let clusterName = clusters.get('firstObject').get('name');

      return this.transitionTo('cluster.data', clusterName);
    }
  },

  setupController: function() {
    this.simulateLoad();
  }
});
