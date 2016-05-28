import Ember from 'ember';

export default Ember.Controller.extend({
  helpVisibile: false,

  actions: {
    removeHelp: function() {
      this.set('helpVisibile', false);
    },

    showHelp: function() {
      this.set('helpVisibile', true);
    }
  }
});
