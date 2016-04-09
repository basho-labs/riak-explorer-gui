import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'table',

  classNames: ['table', 'cluster-table'],

  bucketTypes: null
});
