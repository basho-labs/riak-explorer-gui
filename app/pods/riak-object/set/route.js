import RiakObjectRoute from '../route';

export default RiakObjectRoute.extend({
  actions: {
    /**
     * Adds an element to the set.
     * @event addElement
     * @param {RiakSetObject} set
     * @param {String} newItem Element to be added
     */
    addElement: function(set, newItem) {
      let itemToBeSubmitted = newItem.trim();
      let setItems = set.get('contents').value;

      if (itemToBeSubmitted.length &&
        setItems.indexOf(itemToBeSubmitted) === -1) {
        this.explorer.updateObject(set, { add: itemToBeSubmitted });
        setItems.push(itemToBeSubmitted);
        set.set('contents', { value: setItems });

        // Empty out any lingering warnings on success
        this.removeAlert();
      } else {
        this.showAlert('alerts.error-set-items-unique');
      }
    },

    /**
     * Removes specified element from the set.
     * @event removeElement
     * @param set {RiakSetObject}
     * @param item {String} Element to be removed
     */
    removeElement: function(set, item) {
      let setItems = set.get('contents').value;
      let indexOfItem = setItems.indexOf(item);

      if (indexOfItem > -1) {
        this.explorer.updateObject(set, { remove: item });
        setItems.splice(indexOfItem, 1);
        set.set('contents', { value: setItems });
      }
    }
  }
});
