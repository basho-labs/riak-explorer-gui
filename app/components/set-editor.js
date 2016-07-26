import Ember from 'ember';
import Validations from '../utils/validations';

export default Ember.Component.extend({
  tagName: 'ul',

  classNames: ['object-content-list'],

  newItem: '',

  contents: [],

  actions: {
    addElement: function(item) {
      let trimmedItem = item.trim();
      let isValid = Validations.isUniqueArrayItem(this.get('contents'), item);

      if (isValid) {
        this.sendAction('addSetElement', trimmedItem);
        this.set('newItem', '');
      } else {
        this.sendAction('nonUniqueSetElement', trimmedItem);
      }
    },

    removeElement: function(item) {
      if (Validations.itemExistsInArray(this.get('contents'), item)) {
        this.sendAction('removeSetElement', item);
      }
    }
  }
});
