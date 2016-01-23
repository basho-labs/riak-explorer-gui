import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['dashboard-module'],

  label: null,

  showHeader: function() {
    return !!this.get('label');
  }.property('label')
});
