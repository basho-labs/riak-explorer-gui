import Ember from 'ember';
import Alerts from '../../../mixins/routes/alerts';
import LoadingSlider from '../../../mixins/routes/loading-slider';
import ScrollReset from '../../../mixins/routes/scroll-reset';
import WrapperState from '../../../mixins/routes/wrapper-state';
import _ from 'lodash/lodash';

export default Ember.Route.extend(Alerts, LoadingSlider, ScrollReset, WrapperState, {
  model: function(params) {
    let self = this;

    return this.explorer.getCluster(params.clusterName).then(function(cluster) {
      return self.store.createRecord('table', {
        cluster: cluster,
        columns: [
          { name: '', type: 'varchar' },
          { name: '', type: 'varchar' },
          { name: '', type: 'varchar' }
        ],
        partitionKey: [],
        localKey: []
      });
    });
  },

  afterModel: function(model, transition) {
    this.setSidebarCluster(model.get('cluster'));
    this.setBreadCrumbs({
      cluster: model.get('cluster'),
      crudAction: 'create table'
    });
    this.setViewLabel({
      preLabel: 'Create Table'
    });
    this.simulateLoad();
  },

  setupController: function(controller, model) {
    this._super(controller, model);

    controller.resetState();
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
    willTransition: function() {
      let table = this.currentModel;

      // Destroy in memory model. If the table is successfully created, it will be saved through the normal Ember Data flow.
      table.destroyRecord();
    },

    createTable: function(table, statement) {
      let self = this;
      let controller = this.controller;
      let clusterName = table.get('cluster').get('name');

      controller.set('errors', null);
      controller.set('showSpinner', true);

      let formatted = _.trim(statement.replace(/\s\s+/g, ' ')         // reduces multiple whitespaces into one
                                      .replace(/(\r\n|\n|\r)/gm, ' ') // removes any leftover newlines
                                      .replace(/\( /g, '(')           // removes any spacing following left parenthesis
                                      .replace(/ \)/g, ')'));         // removes any spacing preceding right parenthesis

      let tableName = formatted.split(' ')[2]; // Table name should always come after CREATE TABLE

      let data = {
        name: tableName,
        data: { props: { table_def: formatted } }
      };

      if (this.validateTableClientSide(tableName, data)) {
        this.explorer.createBucketType(clusterName, data).then(
          function onSuccess() {
            self.transitionTo('table',clusterName, tableName).then(function() {
              controller.set('showSpinner', false);
            });
          },
          function onFail(error) {
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
