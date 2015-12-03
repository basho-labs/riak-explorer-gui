import Ember from 'ember';

var ObjectContentsFlagsComponent = Ember.Component.extend({
  actions: {
      /**
       * The user has clicked on the Delete Flag button.
       * Forward the `removeField` action to parent controller.
       *
       * @event removeField
       * @param model {RiakObjectMap} Current map
       * @param field {RiakObjectMapField} Flag to be removed
       */
      removeField(model, field) {
          this.sendAction('removeField', model, 'flag', field);
      }
  }
});
export default ObjectContentsFlagsComponent;
