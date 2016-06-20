import Ember from 'ember';
import ClusterRoute from '../route';

export default ClusterRoute.extend({
  afterModel: function(model, transition) {
    this._super(model, transition);
    this.setViewLabel({
      preLabel: 'Cluster Ops',
      label: model.get('name')
    });
  },

  actions: {
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
