import Ember from 'ember';
import Alerts from '../../../mixins/routes/alerts';
import LoadingSlider from '../../../mixins/routes/loading-slider';
import ScrollReset from '../../../mixins/routes/scroll-reset';
import WrapperState from '../../../mixins/routes/wrapper-state';
import _ from 'lodash/lodash';

export default Ember.Route.extend(Alerts, LoadingSlider, ScrollReset, WrapperState, {
  model: function(params) {
    return this.explorer.getBucketType(params.clusterName, params.bucketTypeName);
  },

  afterModel: function(model, transition) {
    this.setSidebarCluster(model.get('cluster'));
    this.setBreadCrumbs({
      cluster: model.get('cluster'),
      bucketType: model,
      crudAction: 'edit'
    });
    this.setViewLabel({
      preLabel: 'Edit Bucket Type',
      label: model.get('name')
    });
  },

  setupController: function(controller, model) {
    this._super(controller, model);

    let initialProps = {};

    let props = model.get('propsWithHelp');
    let editableProps = props.filter(function(prop) { return prop.editable; });
    let nonEditableProps = props.filter(function(prop) { return !prop.editable; });

    editableProps.forEach(function(prop) {
      initialProps[prop.key] = prop.value;
    });

    controller.set('initialProps', initialProps);
    controller.set('editableProps', editableProps);
    controller.set('nonEditableProps', nonEditableProps);
    controller.set('errors', []);
  },

  actions: {
    updateBucketType: function() {
      let controller = this.get('controller');
      let bucketType = this.currentModel;
      let updatedProps = controller.get('updatedProps');
      let self = this;

      this.explorer.updateBucketType(bucketType, updatedProps).then(
        function onSuccess(data) {
          self.transitionTo('bucket-type', bucketType.get('cluster').get('name'), bucketType.get('name'));
        },

        function onFail(data) {
          if (data.responseText) {
            let errorObj = {
              id: 'server_error',
              message: JSON.parse(data.responseText).error
            };

            controller.get('errors').pushObject(errorObj);
          } else {
            self.render('alerts.error-request-was-not-processed', {
              into: 'application',
              outlet: 'alert'
            });
          }
          self.scrollToTop();
        }
      );
    }
  }
});
