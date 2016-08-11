import EmberHighChartsComponent from 'ember-highcharts/components/high-charts';
import _ from 'lodash/lodash';
/*globals Highcharts */

export default EmberHighChartsComponent.extend({
  defaultOptions: {
    title: {
      text: 'Node Data'
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
    }
  },

  node: null,

  statToGraph: null,

  content: null,

  chartOptions: null,

  mode: "StockChart",

  setInitialData: function() {
    let statName = this.get('statToGraph');
    let options = _.assign(_.cloneDeep(this.defaultOptions), { title: { text: statName } });
    let stats = this.get('node').get('statsHistory');

    this.set('chartOptions', options);
    this.set('content', [{
      name: statName,
      data: stats.map(function(stat) {
        return {
          x: stat.timestamp,
          y: stat.stats[statName]
        };
      }),
      turboThreshold: 0
    }]);
  },

  init: function() {
    this._super(...arguments);
    this.setInitialData();
  },

  streamNewDataIntoChart: function() {
    let chart = this.get('chart');
    let series = _.head(chart.series);
    let stats = this.get('node').get('statsHistory');
    let statName = this.get('chartOptions.title.text');

    series.setData(stats.map(function(stat) {
      return {
        x: stat.timestamp,
        y: stat.stats[statName]
      };
    }));
  }.observes('node.stats'),

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





