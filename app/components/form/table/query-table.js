import Ember from 'ember';
import _ from 'lodash/lodash';

export default Ember.Component.extend({
  tagName: 'form',

  explorer: Ember.inject.service(),

  errors: [],

  table: null,

  queryString: '',

  queryResult: null,

  isDisabled: true,

  example: "select weather, temperature from SomeTable where time > 1234560 and time < 1234569 and myfamily = 'family1' and myseries = 'series1'",

  successMessage: '',

  canSubmit: function() {
    return this.set('isDisabled', Ember.isBlank(this.get('queryString')));
  }.observes('queryString'),

  submit() {
    let self = this;

    return this.get('explorer').queryTable(this.get('table'), this.get('queryString')).then(
      function onSuccess(data) {
        if (Ember.isEmpty(data.query.rows)) {
          self.set('queryResult', 'No rows found');
        } else {
          // TODO: Use when code highlighter is updated
          // let stringifiedData = JSON.stringify(data.query.rows);

          self.set('queryResult', data.query.rows);
        }
      }, function onFail(error) {
        self.get('errors').pushObject('Sorry but your request was not processed correctly.');
      }
    );
  }
});
