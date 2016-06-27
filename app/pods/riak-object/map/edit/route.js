import RiakObjectRoute from '../../route';
import _ from 'lodash/lodash';

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

  // recursive function that iterates through a map and creates the appropriate object
  // for the explorer service call
  mapData: function(map) {
    let self = this;
    let updateObj = { "update": {} };

    Object.keys(map).forEach(function(key) {
      switch(true) {
        case key.endsWith('_counter'):
        case key.endsWith('_register'):
          updateObj.update[key] = map[key];
          break;
        case key.endsWith('_flag'):
          updateObj.update[key] = map[key] ? "enable" : "disable";
          break;
        case key.endsWith('_set'):
          updateObj.update[key] = { "add_all": map[key] };
          break;
        case key.endsWith('_map'):
          updateObj.update[key] =  self.mapData(map[key]);
          break;
        default:
          break;
      }
    });

    return updateObj;
  },

  // TODO: Add validation for correct name endings in keys
  isValid: function() {
    let map = this.currentModel;
    let controller = this.controller;
    let isValid;

    try {
      map.set('contents', JSON.parse(controller.get('stringifiedContents')));

      isValid = true;
    } catch(e) {
      this.scrollToTop();
      this.showAlert('alerts.error-must-be-json-parseable');

      isValid = false;
    }

    return isValid;
  },

  actions: {
    // TODO: Ineffecient function
    //  Destroys and then immediately creates new record. Update directly is possible but requires
    //  creating a in memory version of the new map and comparing against the previous version, and creating all the differences
    //  for each field. Replace if performance becomes an issue.
    updateMap: function() {
      let self = this;
      let map = this.currentModel;
      let controller = this.controller;
      let clusterName = map.get('cluster').get('name');
      let bucketTypeName = map.get('bucketType').get('name');
      let bucketName = map.get('bucket').get('name');
      let objectName = map.get('name');

      if (this.isValid()) {
        let data = this.mapData(map.get('contents'));
        let createNewMap = _.partial(self.explorer.createCRDT, clusterName, bucketTypeName, bucketName, objectName, data);

        controller.set('loadingMessage', 'Updating Map ...');
        controller.set('showLoadingSpinner', true);

        return map.destroyRecord()
           .then(createNewMap)
           .then(
              function onSuccess() {
                self.transitionTo('riak-object.map', clusterName, bucketTypeName, bucketName, objectName);
              },
              function onFail() {
                controller.set('showLoadingSpinner', false);
                self.scrollToTop();
                self.showAlert('alerts.error-request-was-not-processed');
              }
           );
      }
    }
  }
});
