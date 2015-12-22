import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['breadcrumb-container'],

  subSection: null,

  isClusterData: function(){
    return this.get('subSection') === 'data';
  }.property('subSection'),

  isClusterOps: function(){
    return this.get('subSection') === 'ops';
  }.property('ops'),

  isClusterQuery: function(){
    return this.get('subSection') === 'query';
  }.property('subSection')
});
