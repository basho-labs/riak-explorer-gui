import Ember from 'ember';

export default Ember.Component.extend({
  properties: [],

  actions: {
    addNewProperty: function() {
      this.get('properties').pushObject({
        key: '',
        value: ''
      });
    },

    removeProperty: function(index) {
      this.get('properties').removeAt(index);
    }
  }
});
