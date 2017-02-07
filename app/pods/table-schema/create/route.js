import Ember from 'ember';
import Alerts from '../../../mixins/routes/alerts';
import LoadingSlider from '../../../mixins/routes/loading-slider';
import ScrollReset from '../../../mixins/routes/scroll-reset';
import WrapperState from '../../../mixins/routes/wrapper-state';
import _ from 'lodash/lodash';

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

  // parseMessageFields(fields, originalJSON) {
  //   return fields.map(function(field) {
  //     let fieldType = field.type;
  //
  //     if (_.isObject(fieldType) && Ember.isPresent(fieldType.ref)) {
  //       // TODO: Start back here. Prob filter out any ref field types but make sure the references are recursively added to the fields object
  //       // TODO: Ask Glick to clarify how this will work
  //     }
  //
  //     return field;
  //   });
  // },

  retrieveMessages(data) {
    let self = this;
    let messages;

    if (Ember.isPresent(data.messages)) {
      messages = data.messages
        .map(function(message) {
          return {
            name: message.name,
            // TODO: Actually build out messages based on references
            //fields: self.parseFields(message.fields, messageJSON)
            fields: message.fields
              .filter(function(field) { return _.isString(field.type); })
          };
        })
        .map(function(message) {
          return JSON.stringify(message, null, ' ');
        });
    } else {
      // TODO: Send upload fail action or invoke controller errors
      messages = null;
    }

    return messages;
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
        let messages = self.retrieveMessages(data[fileSha]);

        if (messages) {
          self.controller.set('errors', null);
          self.controller.set('fileUploaded', true);
          self.controller.set('messages', messages);
        }
      });
    }
  }
});
