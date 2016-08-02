import Ember from 'ember';
import EmberHighChartsComponent from 'ember-highcharts/components/high-charts';
import _ from 'lodash/lodash';
/*globals Highcharts */

export default EmberHighChartsComponent.extend({
  defaultOptions: {
    chart: {
      type: 'spline',
      animation: Highcharts.svg
    },
    title: {
      text: 'Cluster Data'
    },
    xAxis: {
      type: 'datetime',
      tickPixelInterval: 150
    },
    yAxis: {
      title: {
        text: 'Value'
      },
      plotLines: [{
        value: 0,
        width: 1,
        color: '#808080'
      }]
    },
    tooltip: {
      formatter: function () {
        return '<b>' + this.series.name + '</b><br/>' +
          Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
          Highcharts.numberFormat(this.y, 2);
      }
    },
    legend: {
      enabled: true
    }
  },

  cluster: null,

  statToGraph: null,

  plotThreshold: 10,

  content: null,

  chartOptions: null,

  getMostRecentData: function() {
    let self = this;

    return this.get('cluster').get('nodes').map(function(node) {
      return {
        name: node.get('name'),
        stats: _.takeRight(node.get('statsHistory'), self.get('plotThreshold'))
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
        })
      };
    }));
  },

  init: function() {
    this._super(...arguments);
    this.setInitialData();
  },

  streamNewDataIntoChart: function() {
    let chart = this.get('chart');
    let allSeries = chart.series;
    let data = this.getMostRecentData();
    let statName = this.get('chartOptions.title.text');
    let plotThreshold = this.get('plotThreshold');
    let pointsToPlot = _.head(data).stats.length; // All series have the same amount of points, so grab the first and find out how many

    allSeries.forEach(function(series, index) {
      let redraw = (index + 1 === allSeries.length);
      let newData = data.findBy('name', series.name);

      if (pointsToPlot < plotThreshold) {
        series.setData(newData.stats.map(function(stat) {
          return {
            x: stat.timestamp,
            y: stat.stats[statName]
          };
        }), redraw);
      } else {
        let latestStat = _.last(newData.stats);

        series.addPoint([latestStat.timestamp, latestStat.stats[statName]], true, true);
      }
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
