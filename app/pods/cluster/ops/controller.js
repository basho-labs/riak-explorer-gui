import Ember from 'ember';
import Modal from '../../../mixins/controller/modal';

export default Ember.Controller.extend(Modal, {
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

  actions: {
    cancelReplAction: function() {
      this.set('currentlySelectedAction', '');
      this.set('currentReplOutput', '');
      this.send('hideModal');
    },

    confirmReplAction: function() {
      this.send('hideModal');
      this.send('getReplicationOutput', this.get('currentlySelectedAction'));
    },

    warnReplAction: function(action) {
      this.set('currentlySelectedAction', action);
      this.set('currentReplOutput', '');
      this.send('showModal');
    }
  }
});
