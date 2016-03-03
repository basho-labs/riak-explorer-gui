import Ember from 'ember';
import LoadingSlider from '../../mixins/routes/loading-slider';
import ScrollReset from '../../mixins/routes/scroll-reset';
import WrapperState from '../../mixins/routes/wrapper-state';

export default Ember.Route.extend(LoadingSlider, ScrollReset, WrapperState, {
  model: function(params) {
    return this.explorer.getLogFile(params.clusterName, params.nodeName, params.logName);
  },

  afterModel: function(model, transition) {
    this.setSidebarCluster(model.get('node').get('cluster'));
    this.setBreadCrumbs({
      cluster: model.get('node').get('cluster'),
      node: model.get('node'),
      logFile: model
    });
    this.setViewLabel({
      preLabel: 'Log Detail',
      label: model.get('name')
    });
  },

  actions: {
    refreshLogFile: function(log) {
      log.set('isRefreshing', true);

      // TODO: Add functionality to change the amount of lines the log file is tailing
      this.explorer.getLogFileContents(log).then(function() {
        // The response back from the server is very fast on a lot of these requests,
        //  so let the animation run for an extra second to give the feedback loop that
        //  the request has gone through.
        setTimeout(() => log.set('isRefreshing', false), 1000);
      });
    }
  }
});


