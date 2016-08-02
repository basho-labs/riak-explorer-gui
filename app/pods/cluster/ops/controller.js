import Ember from 'ember';
import Modal from '../../../mixins/controller/modal';

export default Ember.Controller.extend(Modal, {
  // MDC
  replActionModalVisible: false,

  availableReplActions: [
    'Cluster Stats',
    'Cluster Manager',
    'Fullsync Start',
    'Fullsync Stop',
    'Fullsync Coordinate',
    'Realtime Start',
    'Realtime Stop',
    'Realtime Stats',
    'Replication Connections',
    'Replication Clustername'
  ],

  currentlySelectedAction: '',

  currentReplOutput: '',

  // Monitoring
  newGraphModalVisible: false,

  currentGraphs: [],

  availableGraphs: [],

  actions: {
    // MDC
    showReplActionModal: function() {
      this.set('replActionModalVisible', true);
      this.send('showModal');
    },

    hideReplActionModal: function() {
      this.set('replActionModalVisible', false);
      this.send('hideModal');
    },

    cancelReplAction: function() {
      this.set('currentlySelectedAction', '');
      this.set('currentReplOutput', '');
      this.send('hideReplActionModal');
    },

    confirmReplAction: function() {
      this.send('hideReplActionModal');
      this.send('getReplicationOutput', this.get('currentlySelectedAction'));
    },

    warnReplAction: function(action) {
      this.set('currentlySelectedAction', action);
      this.set('currentReplOutput', '');
      this.send('showReplActionModal');
    },

    // Monitoring
    showNewGraphModal: function() {
      this.set('newGraphModalVisible', true);
      this.send('showModal');
    },

    hideNewGraphModal: function() {
      this.set('newGraphModalVisible', false);
      this.send('hideModal');
    },

    updateGraphName: function(graph, newStat) {
      return this.set('currentGraphs', this.get('currentGraphs').map(function(graphName) {
        return (graphName === graph) ? newStat : graphName;
      }));
    },

    addNewGraph: function(graph) {
      this.get('currentGraphs').pushObject(graph);
      this.send('hideNewGraphModal');
    },

    removeGraph: function(graph) {
      this.set('currentGraphs', this.get('currentGraphs').filter(function(graphName) {
        return graphName !== graph;
      }));
    }
  }
});
