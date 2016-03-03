import Ember from 'ember';
import LoadingSlider from '../mixins/routes/loading-slider';
import ScrollReset from '../mixins/routes/scroll-reset';

export default Ember.Route.extend(LoadingSlider, ScrollReset, {
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
