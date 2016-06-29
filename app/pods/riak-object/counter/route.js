import RiakObjectRoute from '../route';

export default RiakObjectRoute.extend({
  afterModel: function(model, transition) {
    this.setSidebarCluster(model.get('cluster'));
    this.setBreadCrumbs({
      cluster: model.get('cluster'),
      bucketType: model.get('bucketType'),
      bucket: model.get('bucket'),
      riakObject: model
    });
    this.setViewLabel({
      preLabel: 'Object',
      label: model.get('name')
    });
  },
  
  actions: {
    increment: function(counter) {
      let currentValue = counter.get('contents');
      let newValue = currentValue + 1;

      counter.set('contents', newValue);
      this.explorer.updateCRDT(counter, { increment: 1 });
    },

    decrement: function(counter) {
      let currentValue = counter.get('contents');
      let newValue = currentValue - 1;

      counter.set('contents', newValue);
      this.explorer.updateCRDT(counter, { decrement: 1 });
    }
  }
});
