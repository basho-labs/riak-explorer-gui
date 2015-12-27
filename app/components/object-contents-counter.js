import Ember from 'ember';

var ObjectContentsCounterComponent = Ember.Component.extend({
  actions: {
    decrementCounter: function(object) {
      // Send action to parent controller
      this.sendAction('decrementCounter', object);
    },

    deleteObject: function(object) {
      // Send action to parent controller
      this.sendAction('deleteObject', object);
    },

    incrementCounter: function(object) {
      // Send action to parent controller
      this.sendAction('incrementCounter', object);
    }
  }
});
export default ObjectContentsCounterComponent;
