import Ember from 'ember';
import Alerts from '../../../mixins/routes/alerts';
import LoadingSlider from '../../../mixins/routes/loading-slider';
import ScrollReset from '../../../mixins/routes/scroll-reset';
import WrapperState from '../../../mixins/routes/wrapper-state';

export default Ember.Route.extend(Alerts, LoadingSlider, ScrollReset, WrapperState, {
  model(params) {
    let self = this;

    return this.explorer.getCluster(params.clusterName).then(function(cluster) {
      return self.store.createRecord('table-schema', { cluster: cluster });
    });
  },

  afterModel(model, transition) {
    this.setSidebarCluster(model.get('cluster'));
    this.setBreadCrumbs({
      cluster: model.get('cluster'),
      crudAction: 'create schema template'
    });
    this.setViewLabel({
      preLabel: 'Schema Template',
      label: 'Create'
    });
  },

  actions: {
    incorrectExtension: function() {
      this.controller.set('errors', "File must have an extension of .proto and be a protocol buffer file to be read.");
    },

    uploadFail(errorObj) {
      // let errorMessage = (Ember.isPresent(errorObj.error)) ? errorObj.error : 'Riak Explorer was not able to parse the uploaded protobuff file. Please check to make sure it is formatted correctly.';
      let errorMessage = 'Riak Explorer was not able to parse the uploaded protobuff file. Please check to make sure it is formatted correctly.';

      this.controller.set('errors', errorMessage);
    },

    uploadSuccess(data) {
      let self = this;
      let clusterName = this.get('currentModel').get('cluster').get('name');
      let fileSha = data.create;

      this.explorer.getProtoBuffMessages(clusterName, fileSha).then(function(data) {
        self.controller.set('errors', null);
        self.controller.set('fileUploaded', true);
        self.controller.set('parsedContents', JSON.stringify(data, null, ' '));
      });
    }
  }
});
