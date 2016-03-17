import Ember from 'ember';

/**
 * Mixin class that allows routes to set state that is part of the "Global" state,
 *  i.e. state that is part of the GUI chrome. Things like sidebars, headers, footers, etc.
 *  To be included on route classes only.
 *
 * @class WrapperState
 */
export default Ember.Mixin.create({
  /**
   * Passes the current cluster object to the sidebar, for display and logic purposes.
   * @method setSidebarCluster
   * @argument Cluster{DS.Store}
   */
  setSidebarCluster(cluster) {
    this.controllerFor('application').set('currentCluster', cluster);
  },

  /**
   * Takes an object with the current breadcrumb state, for display purposes.
   * @method setBreadCrumbs
   * @argument Object
   */
  setBreadCrumbs(breadCrumbMap) {
    if (!breadCrumbMap) { breadCrumbMap = {}; }
    this.controllerFor('application').set('breadCrumbMap', breadCrumbMap);
  },

  /**
   * Takes an object with the current label state, for display purposes.
   * @method setViewLabel
   * @argument Object
   */
  setViewLabel(viewLabelMap) {
    if (!viewLabelMap) { viewLabelMap = {}; }
    this.controllerFor('application').set('viewLabelMap', viewLabelMap);
  }
});
