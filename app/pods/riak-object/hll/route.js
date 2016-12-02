import RiakObjectRoute from '../route';

export default RiakObjectRoute.extend({
  actions: {
    /**
     * Adds an element to the HLL list.
     * @event addSetElement
     * @param {String} item
     */
    addElement: function(item) {
      let self = this;
      let hll = this.currentModel;
      let clusterName = hll.get('cluster').get('name');
      let bucketTypeName = hll.get('bucketType').get('name');
      let bucketName = hll.get('bucket').get('name');
      let objectName = hll.get('name');

      this.explorer.updateCRDT(hll, { add: item }).then(function() {
        return self.explorer.getObject(clusterName, bucketTypeName, bucketName, objectName);
      });
    }
  }
});
