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
      text: 'Node Data'
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
      enabled: false
    },
    exporting: {
      enabled: false
    }
  },

  node: null,

  statToGraph: null,

  plotThreshold: 20,

  content: null,

  chartOptions: null,

  getMostRecentStats: function() {
    return _.takeRight(this.get('node').get('statsHistory'), this.get('plotThreshold'));
  },

  setInitialData: function() {
    let statName = this.get('statToGraph');
    let options = _.assign(_.cloneDeep(this.defaultOptions), { title: { text: statName } });
    let stats = this.getMostRecentStats();

    this.set('chartOptions', options);
    this.set('content', [{
      name: statName,
      data: stats.map(function(stat) {
        return {
          x: stat.timestamp,
          y: stat.stats[statName]
        };
      })
    }]);
  },

  init: function() {
    this._super(...arguments);
    this.setInitialData();
  },

  streamNewDataIntoChart: function() {
    let chart = this.get('chart');
    let series = _.head(chart.series);
    let mostRecentStats = this.getMostRecentStats();
    let statName = this.get('chartOptions.title.text');
    let plotThreshold = this.get('plotThreshold');

    if (mostRecentStats.length < plotThreshold) {
      series.setData(mostRecentStats.map(function(stat) {
        return {
          x: stat.timestamp,
          y: stat.stats[statName]
        };
      }));
    } else {
      let latestStat = _.last(mostRecentStats);

      series.addPoint([latestStat.timestamp, latestStat.stats[statName]], true, true);
    }
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





