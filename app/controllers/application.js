import Ember from 'ember';

export default Ember.Controller.extend({
  currentCluster: null,

  clusterSubSection: null,

  breadCrumbMap: {},

  /**
   * Observes routes and makes sure that if on the index route, to set the current cluster state
   *  to null. Since all routes are nested under the index route, this is the only way we can
   *  reliably ensure that this method is called every time the route is visited.
   *
   * @method resetIndexState
   */
  resetIndexState: function () {
    if (this.get('currentPath') === 'index') {
      this.set('currentCluster', null);
      this.set('breadCrumbMap', {});
    }
  }.observes('currentPath'),

  /**
   * Observes routes and will set the cluster sub-section, based on the route name. Must be updated
   *  any time a new route is added to a subsection
   *
   * @method setClusterSubSection
   */
  setClusterSubSection: function() {
    switch(this.get('currentPath')) {
      case 'bucket-type':
      case 'bucket':
      case 'riak-object':
      case 'riak-object.edit':
      case 'riak-object.counter':
      case 'riak-object.set':
      case 'riak-object.map':
        this.set('clusterSubSection', 'data');
        break;
      case 'node':
      case 'log-file':
      case 'config-file':
        this.set('clusterSubSection', 'ops');
        break;
      case 'search-index':
      case 'search-schema':
      case 'search-schema.edit':
      case 'search-schema.create':
        this.set('clusterSubSection', 'query');
        break;
      default:
        this.set('clusterSubSection', null);
        break;
    }
  }.observes('currentPath'),

  showBreadCrumbs: function() {
    return !!(Object.keys(this.get('breadCrumbMap')).length);
  }.property('breadCrumbMap'),

  actions: {
    clusterSelected(cluster) {
      this.set('currentCluster', cluster);
      // Default to data view since no cluster overview view
      this.transitionToRoute('cluster.data', cluster.get('id'));
    }
  }
});
