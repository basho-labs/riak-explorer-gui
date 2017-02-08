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

  setupController: function(controller, model) {
    this._super(controller, model);

    controller.set('messages', []);
    controller.set('fileUploaded', false);
    controller.set('errors', null);
  },

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
    } else {
      // TODO: Send upload fail action or invoke controller errors
      messages = null;
    }

    return messages;
  },

  formatMessagesIntoTableString(messages) {
    return messages.map(function(message) {
      let fields = message.fields
        .map(function(field) {
          return `  ${field.name} ${field.type.toUpperCase()} NOT NULL`;
        })
        .join(',\n');

      return `CREATE TABLE ${message.name}\n(\n${fields}\n  PRIMARY KEY (\n    (##,##, quantum(##, ##, ##),\n    ##, ##, ##)\n)`;
    });
  },

  validateTableClientSide: function(tableName, tableData) {
    let isValid = true;
    let controller = this.controller;

    // Check if table name already exists
    if (this.currentModel.get('cluster').get('tables').filterBy('name', tableName).length) {
      isValid = false;
      controller.set('errors', `A table named '${tableName}' already exits on the '${this.currentModel.get('cluster').get('name')}' cluster. Please use a unique name for your table.`);
    }

    return isValid;
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
        let quasiTables = self.formatMessagesIntoTableString(messages);

        if (messages) {
          self.controller.set('errors', null);
          self.controller.set('fileUploaded', true);
          self.controller.set('messages', quasiTables);
        }
      });
    },

    createTable: function(table, index) {
      let self = this;
      let controller = this.controller;
      let clusterName = table.get('cluster').get('name');
      let statement = controller.get('schemas')[index];

      controller.set('errors', null);
      controller.set('showSpinner', true);

      let formatted = _.trim(statement.replace(/\s\s+/g, ' ')         // reduces multiple whitespaces into one
        .replace(/(\r\n|\n|\r)/gm, ' ') // removes any leftover newlines
        .replace(/\( /g, '(')           // removes any spacing following left parenthesis
        .replace(/ \)/g, ')'));         // removes any spacing preceding right parenthesis

      // Add space before first parenthesis if needed
      let indexOfFirstParenthesis = formatted.indexOf('(');
      let indexOfCharacterBeforeFirstParenthesis = indexOfFirstParenthesis - 1;
      let characterBeforeFirstParenthesis = formatted[indexOfCharacterBeforeFirstParenthesis];

      if (characterBeforeFirstParenthesis !== ' ') { formatted = insert(formatted, indexOfFirstParenthesis, ' '); }

      let tableName = formatted.split(' ')[2]; // Table name should always come after CREATE TABLE

      let data = {
        name: tableName,
        data: { props: { table_def: formatted } }
      };

      debugger;
      if (this.validateTableClientSide(tableName, data)) {
        this.explorer.createBucketType(clusterName, data).then(
          function onSuccess() {
            debugger;
            self.transitionTo('table',clusterName, tableName).then(function() {
              controller.set('showSpinner', false);
            });
          },
          function onFail(error) {
            debugger;
            self.scrollToTop();
            controller.set('showSpinner', false);

            try {
              controller.set('errors', JSON.parse(error.responseText).error
                .replace(/\s\s+/g, ' ') // reduces multiple whitespaces into one
                .replace(/<<"/g, '')    // removes erlang starting brackets
                .replace(/">>/g, ''));  // removes erlang ending brackets
            } catch(err) {
              controller.set('errors', 'Sorry, something went wrong. Your table was not created');
            }
          });
      } else {
        controller.set('showSpinner', false);
      }
    }
  }
});
