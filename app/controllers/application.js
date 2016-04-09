import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    clusterSelected(cluster) {
      this.set('currentCluster', cluster);
      // Default to data view since no cluster overview view
      this.transitionToRoute('cluster.data', cluster.get('name'));
    }
  },


  /**
   * Current Cluster selected. Used to track sidebar state. Null if no sidebar.
   *
   * @property currentCluster
   */
  currentCluster: null,

  /**
   * Which subsection of the cluster the UI is currently in. Options are "data", "ops", or "query"
   *
   * @property clusterSubSection
   */
  clusterSubSection: null,

  /**
   * Object that hold the current breadcrumb information
   *
   * @property breadCrumbMap
   */
  breadCrumbMap: {},

  /**
   * Object that holds the current view-label information
   *
   * @property viewLabelMap
   */
  viewLabelMap: {},

  /**
   * Observes routes and will set the cluster sub-section, based on the route name. Must be updated
   *  any time a new route is added to a subsection
   *
   * @method setClusterSubSection
   */
  setClusterSubSection: function() {
    switch(this.get('currentPath')) {
      case 'cluster.data':
      case 'bucket-type':
      case 'bucket-type.create':
      case 'bucket-type.edit':
      case 'bucket':
      case 'riak-object':
      case 'riak-object.edit':
      case 'riak-object.counter':
      case 'riak-object.set':
      case 'riak-object.map':
      case 'table':
        this.set('clusterSubSection', 'data');
        break;
      case 'cluster.ops':
      case 'node':
      case 'log-file':
      case 'config-file':
        this.set('clusterSubSection', 'ops');
        break;
      case 'cluster.query':
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

  /**
   * Determines if the UI should show the view-header
   *
   * @method showViewHeader
   * @returns Boolean
   */
  showViewHeader: function() {
    return !!(Object.keys(this.get('breadCrumbMap')).length || Object.keys(this.get('viewLabelMap')).length);
  }.property('breadCrumbMap', 'viewLabelMap'),

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
      this.set('viewLabelMap', {});
    }
  }.observes('currentPath')
});
