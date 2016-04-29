import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['side-drawer'],

  classNameBindings: ['status'],

  label: null,

  visible: false,

  // Hack to get around inability of css to figure this out
  setDrawerPanelClass: function() {
    if (this.get('visible')) {
      this.$().parent().removeClass('drawer-closed');
    } else {
      this.$().parent().addClass('drawer-closed');
    }
  }.observes('visible'),

  status: function() {
    return this.get('visible') ? 'open' : 'closed';
  }.property('visible'),

  actions: {
    close: function() {
      return this.set('visible', false);
    }
  }
});
