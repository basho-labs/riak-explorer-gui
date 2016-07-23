import Ember from 'ember';
import _ from 'lodash/lodash';

export default Ember.Controller.extend({
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
    }
  }
});
