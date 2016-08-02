import Ember from 'ember';
import Modal from '../../../mixins/controller/modal';

export default Ember.Controller.extend(Modal, {
  currentGraphs: [],

  availableGraphs: [],

  actions: {
    updateGraphName: function(graph, newStat) {
      return this.set('currentGraphs', this.get('currentGraphs').map(function(graphName) {
        return (graphName === graph) ? newStat : graphName;
      }));
    },

    addNewGraph: function(graph) {
      this.get('currentGraphs').pushObject(graph);
      this.send('hideModal');
    },

    removeGraph: function(graph) {
      this.set('currentGraphs', this.get('currentGraphs').filter(function(graphName) {
        return graphName !== graph;
      }));
    }
  }
});
