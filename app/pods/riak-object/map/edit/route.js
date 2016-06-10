import RiakObjectRoute from '../../route';

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

  setupController: function(controller, model) {
    this._super(controller, model);

    controller.set('codeString', JSON.stringify(model.get('contents'), null, ' '));
  },

  actions: {
    updateMap: function(map) {
      let controller = this.controller;
      let updatedMapData;

      try {
        updatedMapData = JSON.parse(controller.get('codeString'));
      } catch(e) {
        // show error message
      }

      let clusterName = map.get('cluster').get('name');
      let bucketTypeName = map.get('bucketType').get('name');
      let bucketName = map.get('bucket').get('name');
      let objectName = map.get('name');
      let self = this;

      map.set('contents', updatedMapData);
      map.save().then(function() {
        self.transitionTo('riak-object.map', clusterName, bucketTypeName, bucketName, objectName);
      });
    }
  }
});
