import Ember from 'ember';
import _ from 'lodash/lodash';

export default Ember.Component.extend({
  tagName: 'form',

  explorer: Ember.inject.service(),

  bucketType: null,

  rowsString: '',

  isDisabled: true,

  canSubmit: function() {
    return this.set('isDisabled', Ember.isBlank(this.get('rowsString')));
  }.observes('rowsString'),

  submit() {
    let isFormattedCorrectly;
    let data;
    let self = this;

    try {
      data = JSON.parse(this.get('rowsString').replace(/'/g, '"'));

      if (_.isArray(data)) {
        let arrayLength = data.length;
        let subArrayCount = data.filter(function(item) { return _.isArray(item); }).length;

        isFormattedCorrectly = (arrayLength === subArrayCount);
      } else {
        isFormattedCorrectly = false;
      }
    } catch(e) {
      isFormattedCorrectly = false;
    }

    if (!isFormattedCorrectly) {
      alert('The provided information is not formatted correctly. ' +
            'You must provide an array of sub-arrays. ' +
            'Each sub-array should be a row item'); // TODO: Messaging can use some work
    } else {
      return this.get('explorer').updateTable(this.get('bucketType'), data).then(
        function onSuccess() {
          alert('SUCESS, your data was saved to the table');
          self.set('rowsString', '');
        },
        function onFail(error) {
          alert('Error, failed to save the data to the table, check that it is correctly formatted data.');
        }
      );
    }
  }
});
