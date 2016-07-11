import Ember from 'ember';
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
  serializeMap: function(map) {
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
          updateObj.update[key] =  self.serializeMap(map[key]);
          break;
        default:
          break;
      }
    });

    return updateObj;
  },

  isJsonParseable: function(string) {
    let errors = this.controller.get('errors');
    let isParseable;

    try {
      JSON.parse(string);
      isParseable = true;
    } catch(e) {
      errors.pushObject(`Invalid JSON, must be parseable. Make sure to wrap any keys in double quotes. You can use a linter at <a href="http://jsonlint.com/" target="_blank">JSONLint</a>.`);
      this.scrollToTop();
      isParseable = false;
    }

    return isParseable;
  },

  isObject: function(data) {
    let isObject = _.isPlainObject(data);

    if (!isObject) {
      this.scrollToTop();
      alert('Map must be in javascript object notation.');
    }

    return isObject;
  },

  hasCorrectKeyNameEndingsAndValues: function(object) {
    let errors = this.controller.get('errors');
    let invalidKeys;
    let isValid;

    invalidKeys = Object.keys(object).filter(function(key) {
      let value = object[key];
      let valid;

      switch(true) {
        case key.endsWith('_counter'):
          valid = _.isNumber(value);
          if (!valid) { errors.pushObject(`The value of ${key} must be a number value.`); }
          break;
        case key.endsWith('_register'):
          valid = _.isString(value);
          if (!valid) { errors.pushObject(`The value of ${key} must be a string value.`); }
          break;
        case key.endsWith('_flag'):
          valid = _.isBoolean(value);
          if (!valid) { errors.pushObject(`The value of ${key} must be a boolean value.`); }
          break;
        case key.endsWith('_set'):
          valid = _.isArray(value);
          if (!valid) { errors.pushObject(`The value of ${key} must be a array.`); }
          break;
        case key.endsWith('_map'):
          valid = _.isPlainObject(value);
          if (!valid) { errors.pushObject(`The value of ${key} must be a js object.`); }
          break;
        default:
          valid = false;
          errors.pushObject(`${key} property is not named correctly. The property must end with '_counter', '_register', '_flag', '_set', or '_map' based on the desired type.`);
          break;
      }

      return !valid;
    });

    isValid = !invalidKeys.length;

    return isValid;
  },

  isValid: function(map, stringContents) {
    let isJSON;
    let contents;
    let isObject;
    let correctValues;
    let isValid;

    // First step validations
    isJSON = this.isJsonParseable(stringContents);

    if (isJSON) {
      contents = JSON.parse(stringContents);

      // Second step validations
      isObject = this.isObject(contents);
      correctValues = this.hasCorrectKeyNameEndingsAndValues(contents);
    }

    isValid = isJSON &&
              isObject &&
              correctValues;

    // Set valid contents on map object
    if (isValid) { map.set('contents', contents); }

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

      controller.set('errors', []);

      if (this.isValid(map, controller.get('stringifiedContents'))) {
        let clusterName = map.get('cluster').get('name');
        let bucketTypeName = map.get('bucketType').get('name');
        let bucketName = map.get('bucket').get('name');
        let objectName = map.get('name');
        let data = this.serializeMap(map.get('contents'));
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
