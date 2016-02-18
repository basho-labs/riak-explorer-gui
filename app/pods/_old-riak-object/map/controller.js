import Ember from 'ember';
import RiakObjectController from "../controller";

/**
 * @class RiakObjectMapController
 * @extends RiakObjectController
 * @constructor
 */
var RiakObjectMapController = RiakObjectController.extend({
  actions: {
    /**
     Polls the server to refresh the model
     (kicks off a delayed call to +refreshModel+)
     @method pollForModel
     @param {RiakMapObject} model
     @param {Integer} delay Delay in milliseconds
     */
    pollForModel: function(model, delay) {
      var self = this;
      Ember.run.later(function() {
        self.refreshModel(model);
      }, delay);
    },

    /**
     Reloads the model from the server, updates the controller with it.
     @method refreshModel
     @param {RiakMapObject} model
     */
    refreshModel: function(model) {
      var controller = this;
      controller.get('explorer').getRiakObject(model.get('bucket'),
        model.get('key'), controller.store)
        .then(function(model) {
          controller.set('model', model);
        });
    }
  }
});
export default RiakObjectMapController;
