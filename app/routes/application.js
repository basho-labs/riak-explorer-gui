import Ember from 'ember';

export default Ember.Route.extend({
  // Load the list of available clusters, for the left nav
  model: function() {
    let self = this;

    return this.explorer.getClusters().then(
      function onSuccess(clusters) {
        return clusters;
      },
      function onFail(error) {
        self.transitionTo('error.service-not-found');
      }
    );
  }
});
