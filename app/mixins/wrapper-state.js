import Ember from 'ember';

/**
 * Mixin to allow routes to set global UI state.
 *
 * @mixin SidebarSelect
 */
export default Ember.Mixin.create({
  setSidebarCluster(cluster) {
    this.controllerFor('application').set('currentCluster', cluster);
  },

  setBreadCrumbs(breadCrumbMap) {
    if (!breadCrumbMap) { breadCrumbMap = {}; }
    this.controllerFor('application').set('breadCrumbMap', breadCrumbMap);
  },

  setViewLabel(viewLabelMap) {
    if (!viewLabelMap) { viewLabelMap = {}; }
    this.controllerFor('application').set('viewLabelMap', viewLabelMap);
  }
});
