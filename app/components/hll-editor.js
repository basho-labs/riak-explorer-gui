import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'ul',

  classNames: ['object-content-list'],

  newItem: '',

  contents: [],

  actions: {
    addElement: function(item) {
      let trimmedItem = item.trim();

      this.sendAction('addElement', trimmedItem);
      this.set('newItem', '');
    }
  }
});
