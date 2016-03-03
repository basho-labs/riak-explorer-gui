import Ember from 'ember';
import LoadingSlider from '../../mixins/routes/loading-slider';
import ScrollReset from '../../mixins/routes/scroll-reset';

export default Ember.Route.extend(LoadingSlider, ScrollReset, {
  setupController: function() {
    this.simulateLoad();
  }
});
