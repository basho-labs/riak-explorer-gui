import Ember from 'ember';
import Alerts from '../../../mixins/routes/alerts';
import LoadingSlider from '../../../mixins/routes/loading-slider';
import ScrollReset from '../../../mixins/routes/scroll-reset';
import WrapperState from '../../../mixins/routes/wrapper-state';

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

    controller.set('errors', []);
  },

  actions: {
    createTable: function(tableName) {
      let cluster = this.currentModel;

      this.transitionTo('table', cluster.get('name'), tableName);
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
