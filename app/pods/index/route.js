import Ember from 'ember';
import LoadingSlider from '../../mixins/routes/loading-slider';

export default Ember.Route.extend(LoadingSlider, {
  setupController: function() {
    this.simulateLoad();
  }
});
