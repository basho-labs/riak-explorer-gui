import Ember from 'ember';

export default Ember.Controller.extend({
  availableReplActions: [
    'Cluster Stats',
    'Cluster Manager',
    'Fullsync Start',
    'Fullsync Stop',
    'Fullsync Coordinate',
    'Realtime Start',
    'Realtime Stop',
    'Realtime Stats',
    'Replication Connections',
    'Replication Clustername'
  ],

  currentlySelectedAction: '',

  currentReplOutput: '',

  replBaseRoute: '',

  actions: {
    getReplicationOutput: function(action, name) {
      let slug = '';
      let url = '';
      let self = this;

      this.set('currentlySelectedAction', action);
      this.set('currentReplOutput', '');

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

      url = `${this.replBaseRoute}/${slug}`;

      return new Ember.RSVP.Promise(function(resolve, reject) {
        let request = Ember.$.ajax({
          url: url,
          type: 'GET'
        });

        request.done(function(data) {
          delete data.links;

          self.set('currentReplOutput', JSON.stringify(data, null, ' '));
          resolve(data);
        });

        request.fail(function(data) {
          reject(data);
        });
      });
    }
  }
});
