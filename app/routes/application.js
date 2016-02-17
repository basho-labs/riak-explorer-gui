import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    error: function(error) {
      // An error has occurred that wasn't handled by any route.
      console.log('Unknown error: %O', error);
      this.transitionTo('error.unknown');
    }
  },

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
