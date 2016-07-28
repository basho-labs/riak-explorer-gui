import Ember from 'ember';
import Modal from '../../../mixins/controller/modal';
import _ from 'lodash/lodash';

export default Ember.Controller.extend(Modal, {
  currentGraphs: [],

  allAvailableStats: [],

  currentlyAvailableStats: [],

  setGraphOptions: function() {
    let currentlyGraphedStats = this.get('currentGraphs');

    return this.set('currentlyAvailableStats', _.difference(this.get('allAvailableStats'), currentlyGraphedStats));
  }.observes('currentGraphs'),

  actions: {
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
