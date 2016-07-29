import Ember from 'ember';
import Modal from '../../../mixins/controller/modal';
import _ from 'lodash/lodash';

export default Ember.Controller.extend(Modal, {
  // MDC
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
  currentGraphs: [],

  allAvailableStats: [],

  currentlyAvailableStats: [],

  setGraphOptions: function() {
    let currentlyGraphedStats = this.get('currentGraphs');

    return this.set('currentlyAvailableStats', _.difference(this.get('allAvailableStats'), currentlyGraphedStats));
  }.observes('currentGraphs'),

  actions: {
    // MDC
    cancelReplAction: function() {
      this.set('currentlySelectedAction', '');
      this.set('currentReplOutput', '');
      this.send('hideModal');
    },

    confirmReplAction: function() {
      this.send('hideModal');
      this.send('getReplicationOutput', this.get('currentlySelectedAction'));
    },

    warnReplAction: function(action) {
      this.set('currentlySelectedAction', action);
      this.set('currentReplOutput', '');
      this.send('showModal');
    },

    updateGraphName: function(graph, newStat) {
      return this.set('currentGraphs', this.get('currentGraphs').map(function(graphName) {
        return (graphName === graph) ? newStat : graphName;
      }));
    },

    addNewGraph: function(graph) {
      this.get('currentGraphs').pushObject(graph);
      this.setGraphOptions();
      this.send('hideModal');
    },

    removeGraph: function(graph) {
      this.set('currentGraphs', this.get('currentGraphs').filter(function(graphName) {
        return graphName !== graph;
      }));
    }
  }
});
