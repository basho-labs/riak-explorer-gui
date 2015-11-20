import Ember from 'ember';

/**
 * Displays and manages a list of all field types in a Map.
 * @see RiakObjectMap
 *
 * @class ObjectContentsMapComponent
 * @extends Ember.Component
 * @constructor
 */
var ObjectContentsMapComponent = Ember.Component.extend({
    explorer: Ember.inject.service('explorer'),
    store: Ember.inject.service('store'),

    actions: {
      /**
       * The user has added an element to a nested Set field.
       *
       * @event addElement
       * @param setField {RiakObjectMapField} A nested Set field
       * @param newElement {String} New element to be added
       */
      addElement: function(setField, newElement) {
          this.get('explorer').updateDataType(setField, 'addElement', newElement);
          setField.addElement(newElement);
      },

      /**
       * The user has clicked on the 'Add Field' button.
       * Creates a new field object and adds it to this map's contents.
       *
       * @event addField
       * @param model {RiakObjectMap} Parent map model
       * @param fieldType {String} Field type ('register', 'flag' or 'counter')
       * @param newFieldName {String} Name of the register to be added
       * @param newFieldValue {String} Value for the register to be added
       */
      addField(model, fieldType, newFieldName, newFieldValue) {
          if(!newFieldName || !newFieldValue) {
              return;  // Fields must have non-empty names and values
          }
          let newField = this.get('store').createRecord(
              'riak-object.map-field', {
                  fieldType: fieldType,
                  name: newFieldName,
                  parentMap: model,
                  rootMap: model.get('rootMap'),
                  value: newFieldValue
              });
          newField.normalizeName();
          this.get('explorer').updateDataType(model, 'addField', newField);
          model.addField(fieldType, newField);
      },

      deleteObject: function(object) {
          // Send action to parent controller
          this.sendAction('deleteObject', object);
      },

      editField(model, fieldType, field) {
          alert('Edit Field!');
      },

      /**
       * The user has clicked on a Remove Field button.
       * Removes the specified nested field from this map.
       *
       * @event removeCounter
       * @param model {RiakObjectMap} Current map
       * @param fieldType {String}
       * @param field {RiakObjectMapField} Field to be removed
       */
      removeField(model, fieldType, field) {
          this.get('explorer').updateDataType(model, 'removeField', field);
          model.removeField(fieldType, field);
      },

      /**
       * The user has removed an element from the nested Set field.
       *
       * @event removeElement
       * @param setField {RiakObjectMapField}
       * @param element {String}
       */
      removeElement: function(setField, element) {
          this.get('explorer').updateDataType(setField, 'removeElement', element);
          setField.removeElement(element);
      }
    }
});
export default ObjectContentsMapComponent;
