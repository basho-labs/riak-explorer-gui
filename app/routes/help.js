import Ember from 'ember';
import WrapperState from '../mixins/wrapper-state';

export default Ember.Route.extend(WrapperState, {
  model: function(params) {
    return null;
  },

  afterModel: function(model, transition) {
    this.setBreadCrumbs(null);
    this.setViewLabel({
      preLabel: 'Help Section'
    });
  }
});
