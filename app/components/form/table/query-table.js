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

  example: "",

  successMessage: '',

  setExampleMessage: function() {
    let table = this.get('table');
    let tableName = table.get('name');
    let familyName = table.get('familyField').name;
    let seriesName = table.get('seriesField').name;
    let quantumName = table.get('quantumField').name;
    let example = `select * from ${tableName} where ${quantumName} > 1 and ${quantumName} < 100 and ${familyName} = 'foo' and ${seriesName} = 'bar'`;

    return this.set('example', example);
  },

  canSubmit: function() {
    return this.set('isDisabled', Ember.isBlank(this.get('queryString')));
  }.observes('queryString'),

  didReceiveAttrs: function() {
    this.setExampleMessage();
  },

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
