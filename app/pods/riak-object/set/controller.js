import Ember from 'ember';
import RiakObjectController from "../controller";

var RiakObjectSetController = RiakObjectController.extend({
  actions: {
    /**
     * Adds an element to the set.
     * @event addElement
     * @param {RiakSetObject} set
     * @param {String} newItem Element to be added
     */
    addElement: function(set, newItem) {
      this.get('explorer').updateDataType(set, 'addElement', newItem);
      set.addElement(newItem);
    },

    /**
     * Polls the server to refresh the model
     * (kicks off a delayed call to +refreshModel+)
     * @param {RiakSetObject} model
     * @param {Integer} delay Delay in milliseconds
     */
    pollForModel: function(model, delay) {
      var self = this;
      Ember.run.later(function() {
        self.refreshModel(model);
      }, delay);
    },

    /**
     * Reloads the model from the server, updates the controller with it.
     * @param {RiakSetObject} model
     */
    refreshModel: function(model) {
      var controller = this;
      controller.get('explorer').getRiakObject(model.get('bucket'),
        model.get('key'), controller.store)
        .then(function(model) {
          controller.set('model', model);
        });
    },

    /**
     * Removes specified element from the set.
     * @event removeElement
     * @param set {RiakSetObject}
     * @param item {String} Element to be removed
     */
    removeElement: function(set, item) {
      this.get('explorer').updateDataType(set, 'removeElement', item);
      set.removeElement(item);
    }
  }
});
export default RiakObjectSetController;
