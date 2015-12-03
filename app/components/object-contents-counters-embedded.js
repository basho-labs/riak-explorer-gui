import ObjectContentsCounterComponent from "./object-contents-counter";

var ObjectContentsCountersEmbeddedComponent = ObjectContentsCounterComponent.extend({
    actions: {
        /**
         * The user has clicked on the Delete Counter button.
         * Forward the `removeField` action to parent controller.
         *
         * @event removeField
         * @param model {RiakObjectMap} Current map
         * @param field {RiakObjectMapField} Counter to be removed
         */
        removeField(model, field) {
            this.sendAction('removeField', model, 'counter', field);
        }
    }
});
export default ObjectContentsCountersEmbeddedComponent;
