import Ember from 'ember';

export default Ember.Controller.extend({
  currentCluster: null,

  /**
   * Observes routes and makes sure that if on the index route, to set the current cluster state
   *  to null. Since all routes are nested under the index route, this is the only way we can
   *  reliably ensure that this method is called every time the route is visited.
   *
   * @method setSidebarState
   */
  setSidebarState: function () {
    switch(this.get('currentPath')) {
      case 'index':
        this.set('currentCluster', null);
        break;
    }
  }.observes('currentPath'),

  actions: {
    clusterSelected(cluster) {
      this.set('currentCluster', cluster);
      // Default to data view since no cluster overview view
      this.transitionToRoute('cluster.data', cluster.get('id'));
    }
  }
});
