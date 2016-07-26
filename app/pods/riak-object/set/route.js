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
      let contents = set.get('contents');

      this.explorer.updateCRDT(set, { add: item }).then(function() {
        // TODO: items are alphasorted on load, should these be injected alphabetically???
        //       may not be as obvious to user that the object was inserted. Maybe add loading state?
        contents.pushObject(item);
      });

      // Empty out any lingering warnings on success
      this.removeAlert();
    },

    /**
     * Removes specified element from the set.
     * @event removeSetElement
     * @param {String} item
     */
    removeSetElement: function(item) {
      let set = this.currentModel;
      let contents = set.get('contents');
      let index = contents.indexOf(item);

      this.explorer.updateCRDT(set, { remove: item }).then(function() {
        contents.removeAt(index, 1);
      });
    },

    nonUniqueSetElement: function() {
      this.showAlert('alerts.error-set-items-unique');
    }
  }
});
