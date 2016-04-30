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
        fields: [
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
      tableCreate: true
    });
    this.setViewLabel({
      preLabel: 'Create Table'
    });
    this.simulateLoad();
  },

  setupController: function(controller, model) {
    this._super(controller, model);

    controller.set('errors', null);
    controller.set('statement', '');
  },

  actions: {
    willTransition: function() {
      let table = this.currentModel;

      // Destroy in memory model. If the table is successfully created, it will be saved through the normal Ember Data flow.
      table.destroyRecord();
    },

    createTable: function(tableName) {
      // let cluster = this.currentModel;
      //
      // this.transitionTo('table', cluster.get('name'), tableName);
    },

    createTableManually: function() {
      let self = this;
      let controller = this.controller;
      let clusterName = this.currentModel.get('cluster').get('name');
      let statement = controller.get('statement');

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

      this.explorer.createBucketType(clusterName, data).then(
        function onSuccess() {
          self.transitionTo('table',clusterName, tableName);
        },
        function onFail(error) {
          self.scrollToTop();
          controller.set('errors', 'Sorry, something went wrong. Your table was not created');
          controller.set('showSpinner', false);
        });
    },

    addField: function(type) {
      switch(type) {
        case 'tableField':
          this.currentModel.get('fields').pushObject({ name: '', type: 'varchar' });
          break;
        case 'partitionKeyField':
          let suggestedPartitionKeyField = this.currentModel.get('suggestedPartitionKey');
          this.currentModel.get('partitionKey').pushObject({ name: suggestedPartitionKeyField, quantum: false });
          break;
        case 'partitionKeyQuantum':
          let suggestedPartitionKeyQuantum = this.currentModel.get('suggestedPartitionKeyQuantum');
          this.currentModel.get('partitionKey').pushObject({ name: suggestedPartitionKeyQuantum, quantum: true });
          break;
        case 'localKey':
          this.currentModel.get('localKey').pushObject('');
          break;
      }
    },

    removeField: function(group, index) {
      let table = this.currentModel;

      switch(group) {
        case 'tableField':
          table.get('fields').removeAt(index);
          break;
        case 'partitionKey':
          table.get('partitionKey').removeAt(index);
          break;
        case 'localKey':
          table.get('localKey').removeAt(index);
          break;
        default:
          break;
      }
    }
  }
});
