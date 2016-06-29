import Ember from 'ember';
import Alerts from '../../../mixins/routes/alerts';
import LoadingSlider from '../../../mixins/routes/loading-slider';
import ScrollReset from '../../../mixins/routes/scroll-reset';
import WrapperState from '../../../mixins/routes/wrapper-state';

export default Ember.Route.extend(Alerts, LoadingSlider, ScrollReset, WrapperState, {
  model: function(params) {
    let self = this;

    return this.explorer.getBucketType(params.clusterName, params.bucketTypeName).then(function(bucketType) {
      return self.store.createRecord('bucket', {
        bucketType: bucketType,
        name: ''
      });
    });
  },

  afterModel: function(model, transition) {
    this.setSidebarCluster(model.get('cluster'));
    this.setBreadCrumbs({
      cluster: model.get('cluster'),
      bucketType: model.get('bucketType'),
      crudAction: 'create bucket'
    });
    this.setViewLabel({
      preLabel: 'Create Bucket'
    });
  },

  setupController: function(controller, model) {
    this._super(controller, model);

    controller.clearState();
  },

  actions: {
    willTransition: function() {
      let bucketType = this.currentModel;
      bucketType.destroyRecord();
    }
  }

});
