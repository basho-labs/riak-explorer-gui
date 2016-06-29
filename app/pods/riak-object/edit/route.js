import RiakObjectRoute from '../route';

export default RiakObjectRoute.extend({
  afterModel: function(model, transition) {
    this.setSidebarCluster(model.get('cluster'));
    this.setBreadCrumbs({
      cluster: model.get('cluster'),
      bucketType: model.get('bucketType'),
      bucket: model.get('bucket'),
      riakObject: model,
      crudAction: 'edit'
    });
    this.setViewLabel({
      preLabel: 'Object',
      label: model.get('name')
    });
  },

  actions: {
    updateObject: function(object) {
      let self = this;
      let controller = this.controller;
      let clusterName = object.get('cluster').get('name');
      let bucketTypeName = object.get('bucketType').get('name');
      let bucketName = object.get('bucket').get('name');
      let objectName = object.get('name');

      try {
        object.set('contents', JSON.parse(controller.get('stringifiedContents')));
        object.save().then(function() {
          self.transitionTo('riak-object', clusterName, bucketTypeName, bucketName, objectName);
        });
      } catch(e) {
        self.scrollToTop();
        self.showAlert('alerts.error-must-be-json-parseable');
      }
    }
  }
});
