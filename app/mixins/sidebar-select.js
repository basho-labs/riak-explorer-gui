import Ember from 'ember';

/**
 * Mixin to allow routes to set sidebar state.
 *
 * @mixin SidebarSelect
 */
export default Ember.Mixin.create({
  setSidebarCluster(cluster) {
    this.controllerFor('application').set('currentCluster', cluster);
  }
});
