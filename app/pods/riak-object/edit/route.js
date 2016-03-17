import RiakObjectRoute from '../route';

export default RiakObjectRoute.extend({
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
