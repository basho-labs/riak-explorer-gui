import Ember from 'ember';
import RiakObjectController from "../controller";

var RiakObjectCounterController = RiakObjectController.extend({
  actions: {
    incrementCounter: function(object) {
      this.get('explorer').updateDataType(object, 'increment');

      object.increment(object.get('incrementBy'));
    },

    decrementCounter: function(object) {
      this.get('explorer').updateDataType(object, 'decrement');

      object.decrement(object.get('decrementBy'));
    }
  }
});

export default RiakObjectCounterController;
