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

// addElement: function(set, newItem) {
//   let itemToBeSubmitted = newItem.trim();
//   let setItems = set.get('contents');
//
//   if (itemToBeSubmitted.length &&
//     setItems.indexOf(itemToBeSubmitted) === -1) {
//
//     setItems.pushObject(itemToBeSubmitted);
//     this.explorer.updateCRDT(set, { add: itemToBeSubmitted });
//
//     // Empty out any lingering warnings on success
//     this.removeAlert();
//   } else {
//     this.showAlert('alerts.error-set-items-unique');
//   }
// },

// /**
//  * Removes specified element from the set.
//  * @event removeElement
//  * @param {DS.Model} set
//  * @param {String} item
//  */
// removeElement: function(item) {
//   if (this.get('contents').indexOf(item) > -1) {
//     this.sendAction('addSetElement', trimmedItem);
//
//     setItems.removeAt(indexOfItem, 1);
//     this.explorer.updateCRDT(set, { remove: item });
//   }
// }
