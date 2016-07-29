import Ember from 'ember';
import LoadingSlider from '../../../mixins/routes/loading-slider';
import ScrollReset from '../../../mixins/routes/scroll-reset';
import WrapperState from '../../../mixins/routes/wrapper-state';
import _ from 'lodash/lodash';

export default Ember.Route.extend(LoadingSlider, ScrollReset, WrapperState, {
  model: function(params) {
    let self = this;

    return this.explorer.getCluster(params.clusterName)
      .then(function(cluster) {
        return Ember.RSVP.allSettled([
          cluster,
          self.explorer.getNodesStats(cluster)
        ]);
      })
      .then(function(PromiseArray) {
        let cluster = PromiseArray[0].value;

        return cluster;
      });
  },

  afterModel: function(model, transition) {
    this.setSidebarCluster(model);
    this.setBreadCrumbs(null);
    this.setViewLabel({
      preLabel: 'Cluster Ops',
      label: model.get('name')
    });
    this.simulateLoad();
  },

  setupController: function(controller, model) {
    this._super(controller, model);

    if (model.get('nodes').get('length')) {
      let firstNode = _.head(model.get('nodes').toArray());

      controller.set('allAvailableStats', Object.keys(firstNode.get('stats')));
      controller.set('currentGraphs', ['cpu_avg1']);
    }
  },

  actions: {
    // TODO: Move this logic elsewhere
    getReplicationOutput: function(action) {
      let controller = this.controller;
      let cluster = this.currentModel;
      let slug;
      let url;

      // Map action to api slug
      switch(action) {
        case 'Cluster Stats':
          slug = 'repl-clusterstats';
          break;
        case 'Cluster Manager':
          slug = 'repl-clusterstats-cluster_mgr';
          break;
        case 'Fullsync Start':
          slug = 'repl-fullsync-start';
          break;
        case 'Fullsync Stop':
          slug = 'repl-fullsync-stop';
          break;
        case 'Fullsync Coordinate':
          slug = 'repl-clusterstats-fs_coordinate';
          break;
        case 'Realtime Start':
          slug = 'repl-realtime-start';
          break;
        case 'Realtime Stop':
          slug = 'repl-realtime-stop';
          break;
        case 'Realtime Stats':
          slug = 'repl-clusterstats-realtime';
          break;
        case 'Replication Connections':
          slug = 'repl-connections';
          break;
        case 'Replication Clustername':
          slug = 'repl-clustername';
          break;
        default:
          break;
      }

      url = `control/clusters/${cluster.get('name')}/${slug}`;

      return new Ember.RSVP.Promise(function(resolve, reject) {
        let request = Ember.$.ajax({
          url: url,
          type: 'GET'
        });

        request.done(function(data) {
          delete data.links;

          controller.set('currentReplOutput', JSON.stringify(data, null, ' '));
          resolve(data);
        });

        request.fail(function(data) {
          reject(data);
        });
      });
    }
  }
});

