import RiakObjectRoute from '../route';

export default RiakObjectRoute.extend({
  actions: {
    /**
     * Adds an element to the set.
     * @event addSetElement
     * @param {String} item
     */
    addSetElement: function(item) {
      let set = this.currentModel;

      set.get('contents').pushObject(item);
      this.explorer.updateCRDT(set, { add: item });

      // Empty out any lingering warnings on success
      this.removeAlert();
    },

    /**
     * Removes specified element from the set.
     * @event removeElement
     * @param {DS.Model} set
     * @param {String} item
     */
    removeSetElement: function(item) {
      let setItems = set.get('contents');
      let indexOfItem = setItems.indexOf(item);

      if (indexOfItem > -1) {
        setItems.removeAt(indexOfItem, 1);
        this.explorer.updateCRDT(set, { remove: item });
      }
    },

    nonUniqueSetElement: function() {
      this.showAlert('alerts.error-set-items-unique');
    }
  }
});
