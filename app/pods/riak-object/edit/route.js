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
    saveObject: function(object) {
      let clusterName = object.get('cluster').get('name');
      let bucketTypeName = object.get('bucketType').get('name');
      let bucketName = object.get('bucket').get('name');
      let objectName = object.get('name');
      let self = this;

      object.save().then(function() {
        self.transitionTo('riak-object', clusterName, bucketTypeName, bucketName, objectName);
      });
    }
  }
});
