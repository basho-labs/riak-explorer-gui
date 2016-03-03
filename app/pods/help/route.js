import Ember from 'ember';
import LoadingSlider from '../../mixins/routes/loading-slider';
import ScrollReset from '../../mixins/routes/scroll-reset';
import WrapperState from '../../mixins/routes/wrapper-state';

export default Ember.Route.extend(LoadingSlider, ScrollReset, WrapperState, {
  model: function(params) {
    return null;
  },

  afterModel: function(model, transition) {
    this.setBreadCrumbs(null);
    this.setViewLabel({
      preLabel: 'Help Section'
    });
    this.simulateLoad();
  }
});

