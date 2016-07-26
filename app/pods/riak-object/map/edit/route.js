import RiakObjectRoute from '../../route';
import _ from 'lodash/lodash';
import Validations from '../../../../utils/validations';
import Formatter from '../../../../utils/riak-object-formatter';

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

  isValid: function(proposedStringContents) {
    let errors = this.controller.get('errors');
    let JSON;
    let isObject;
    let correctValues;

    try {
      JSON = Validations.isJsonParseable(proposedStringContents);
      isObject = Validations.isObject(JSON);
      correctValues = Validations.mapHasCorrectKeyNameEndingsAndValues(JSON);
    } catch(e) {
      errors.pushObject(e.message);
      this.scrollToTop();
    }

    return JSON && isObject && correctValues;
  },

  actions: {
    // TODO: Inefficient function
    //  Destroys and then immediately creates new record. Update directly is possible but requires
    //  creating a in memory version of the new map and comparing against the previous version, and creating all the differences
    //  for each field. Replace if performance becomes an issue.
    updateMap: function() {
      let self = this;
      let map = this.currentModel;
      let controller = this.controller;
      let desiredContents = controller.get('stringifiedContents');

      controller.set('errors', []);

      if (this.isValid(desiredContents)) {
        let clusterName = map.get('cluster').get('name');
        let bucketTypeName = map.get('bucketType').get('name');
        let bucketName = map.get('bucket').get('name');
        let objectName = map.get('name');

        let data = Formatter.formatNewMap(JSON.parse(desiredContents));
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
