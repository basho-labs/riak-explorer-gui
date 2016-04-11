import Ember from 'ember';
import _ from 'lodash/lodash';
import ScrollReset from '../../../mixins/component/scroll-reset';

export default Ember.Component.extend(ScrollReset, {
  tagName: 'form',

  explorer: Ember.inject.service(),

  table: null,

  errors: [],

  successMessage: '',

  rowsString: '',

  isDisabled: true,

  canSubmit: function() {
    return this.set('isDisabled', Ember.isBlank(this.get('rowsString')));
  }.observes('rowsString'),

  clearErrors: function() {
    return this.set('errors', []);
  },

  resetState: function() {
    this.clearErrors();

    return this.set('rowsString', '');
  },

  prepareData: function() {
    let data;

    try { data = JSON.parse(this.get('rowsString').replace(/'/g, '"')); } catch(e) {}

    return data;
  },

  validateData: function(data) {
    let isValid = false;

    if (data && _.isArray(data)) {
      let arrayLength = data.length;
      let subArrayCount = data.filter(function(item) { return _.isArray(item); }).length;
      isValid = (arrayLength === subArrayCount);
    }

    if (!isValid) {
      this.get('errors').pushObject('Submitted Data is not valid. The textfield expects an array of arrays, each sub-array representing a row to be inserted. View the example for valid input.');
      this.scrollToTop();
    }

    return isValid;
  },

  submit() {
    this.clearErrors();

    let data = this.prepareData();
    let isValid = this.validateData(data);
    let self = this;

    if (isValid)  {
      return this.get('explorer').updateTable(this.get('table'), data).then(
        function onSuccess() {
          let tableName = self.get('table').get('name');

          self.set('successMessage', `Your data was saved to the ${tableName} table.`);
          self.scrollToTop();
          self.resetState();
        },
        function onFail(error) {
          self.get('errors').pushObject('The server failed to save the data to the table, check that your data is formatted correctly and try again.');
          self.scrollToTop();
        }
      );
    }
  }
});
