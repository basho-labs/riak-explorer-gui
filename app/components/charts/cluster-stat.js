import Ember from 'ember';
import EmberHighChartsComponent from 'ember-highcharts/components/high-charts';
import _ from 'lodash/lodash';
/*globals Highcharts */

export default EmberHighChartsComponent.extend({
  defaultOptions: {
    title: {
      text: 'Cluster Data'
    },
    rangeSelector: {
      buttons: [{
        count: 1,
        type: 'minute',
        text: '1M'
      }, {
        count: 5,
        type: 'minute',
        text: '5M'
      }, {
        count: 10,
        type: 'minute',
        text: '10M'
      }, {
        count: 30,
        type: 'minute',
        text: '30M'
      }, {
        type: 'all',
        text: 'All'
      }],
      inputEnabled: false,
      selected: 0
    },
    legend: {
      enabled: true
    }
  },

  cluster: null,

  statToGraph: null,

  content: null,

  chartOptions: null,

  mode: "StockChart",

  getMostRecentData: function() {
    let self = this;

    return this.get('cluster').get('nodes').map(function(node) {
      return {
        name: node.get('name'),
        stats: node.get('statsHistory')
      };
    });
  },

  setInitialData: function() {
    let statName = this.get('statToGraph');
    let options = _.assign(_.cloneDeep(this.defaultOptions), { title: { text: statName } });
    let data = this.getMostRecentData();

    this.set('chartOptions', options);
    this.set('content', data.map(function(node) {
      return {
        name: node.name,
        data: node.stats.map(function(stat) {
          return {
            x: stat.timestamp,
            y: stat.stats[statName]
          };
        }),
        type: 'spline',
        turboThreshold: 0
      };
    }));
  },

  init: function() {
    this._super(...arguments);
    this.setInitialData();
  },

  streamNewDataIntoChart: function() {
    let chart = this.get('chart');
    let allSeries = chart.series.filter(node => node.name !== 'Navigator');
    let data = this.getMostRecentData();
    let statName = this.get('chartOptions.title.text');

    allSeries.forEach(function(series, index) {
      let redraw = (index + 1 === allSeries.length);
      let newData = data.findBy('name', series.name);

      series.setData(newData.stats.map(function(stat) {
        return {
          x: stat.timestamp,
          y: stat.stats[statName]
        };
      }), redraw);
    });
  },

  debouncedObserver: function() {
    Ember.run.debounce(this, this.streamNewDataIntoChart, 1000);
  }.observes('cluster.nodes.@each.stats'),

  switchChart: function() {
    let statName = this.get('statToGraph');
    let currentDisplayedStat = this.get('chartOptions.title.text');
    let chart = this.get('chart');

    if (statName !== currentDisplayedStat) {
      this.setInitialData();
      chart.redraw();
    }
  }.observes('statToGraph')
});
