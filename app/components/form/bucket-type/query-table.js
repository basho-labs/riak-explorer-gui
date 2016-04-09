import Ember from 'ember';
import _ from 'lodash/lodash';

export default Ember.Component.extend({
  tagName: 'form',

  explorer: Ember.inject.service(),

  bucketType: null,

  queryString: '',

  isDisabled: true,

  canSubmit: function() {
    return this.set('isDisabled', Ember.isBlank(this.get('queryString')));
  }.observes('queryString'),

  submit() {
    return this.get('explorer').queryTable(this.get('bucketType'), this.get('queryString')).then(
      function onSuccess(data) {
        console.log('success');
      }, function onFail(error) {
        console.log('fail');
      }
    );
  }
});
