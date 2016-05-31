import Ember from 'ember';

export default Ember.Mixin.create({
  startPolling: function(callback, interval=1000) {
    this.set('timer', Ember.run.later(this, function() {
      callback();
    }, interval));
  },

  stopPolling: function() {
    return Ember.run.cancel(this.get('timer'));
  }
});
