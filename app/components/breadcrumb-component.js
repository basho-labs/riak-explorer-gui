import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['breadcrumb-container'],

  clusterSubSection: null,

  data: null,

  isClusterData: function(){
    return this.get('clusterSubSection') === 'data';
  }.property('clusterSubSection'),

  isClusterOps: function(){
    return this.get('clusterSubSection') === 'ops';
  }.property('clusterSubSection'),

  isClusterQuery: function(){
    return this.get('clusterSubSection') === 'query';
  }.property('clusterSubSection')
});
