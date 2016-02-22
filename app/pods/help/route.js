import Ember from 'ember';
import WrapperState from '../../mixins/routes/wrapper-state';
import LoadingSlider from '../../mixins/routes/loading-slider';

export default Ember.Route.extend(WrapperState, LoadingSlider, {
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

