import ObjectContentsMapComponent from "./object-contents-set";

var ObjectContentsMapsEmbeddedComponent = ObjectContentsMapComponent.extend({
    actions: {
        addField(model, fieldType, newName, newValue) {
            this.sendAction('addField', model, fieldType, newName, newValue);
        },

        /**
         * The user has clicked on a Remove Nested Field button.
         * Forward the `removeField` action to parent controller.
         *
         * @event removeField
         * @param model {RiakObjectMap} Current map
         * @param field {RiakObjectMapField} Field to be removed
         */
        removeField(model, fieldType, field) {
            this.sendAction('removeField', model, fieldType, field);
        }
    }
});
export default ObjectContentsMapsEmbeddedComponent;
