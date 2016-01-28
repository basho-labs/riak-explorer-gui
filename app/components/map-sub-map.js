import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['map-sub-map'],

  showContent: false,

  actions: {
    subMapToggle: function() {
      return this.set('showContent', !this.get('showContent'));
    }
  }
});
