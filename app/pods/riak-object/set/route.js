import RiakObjectRoute from '../route';

export default RiakObjectRoute.extend({
  actions: {
    /**
     * Adds an element to the set.
     * @event addElement
     * @param {DS.Model} set
     * @param {String} newItem
     */
    addElement: function(set, newItem) {
      let itemToBeSubmitted = newItem.trim();
      let setItems = set.get('contents');

      if (itemToBeSubmitted.length &&
        setItems.indexOf(itemToBeSubmitted) === -1) {

        setItems.pushObject(itemToBeSubmitted);
        this.explorer.updateObject(set, { add: itemToBeSubmitted });

        // Empty out any lingering warnings on success
        this.removeAlert();
      } else {
        this.showAlert('alerts.error-set-items-unique');
      }
    },

    /**
     * Removes specified element from the set.
     * @event removeElement
     * @param {DS.Model} set
     * @param {String} item
     */
    removeElement: function(set, item) {
      let setItems = set.get('contents');
      let indexOfItem = setItems.indexOf(item);

      if (indexOfItem > -1) {
        setItems.removeAt(indexOfItem, 1);
        this.explorer.updateObject(set, { remove: item });
      }
    }
  }
});
