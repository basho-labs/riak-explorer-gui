import Ember from 'ember';
import _ from 'lodash/lodash';

export default Ember.Component.extend({
  tagName: 'form',

  explorer: Ember.inject.service(),

  example: "",

  loadingMessage: 'Querying...',

  table: null,

  queryString: '',

  queryResult: '',

  queryResultLength: null,

  isDisabled: true,

  showClear: false,

  canClear: function() {
    let queryResult = this.get('queryResult');
    let canClear = Ember.isPresent(queryResult) && queryResult !== this.get('loadingMessage');

    return this.set('showClear', canClear);
  }.observes('queryResult'),

  canSubmit: function() {
    return this.set('isDisabled', Ember.isBlank(this.get('queryString')));
  }.observes('queryString'),

  // TODO: Come back and make the example dynamic
  setExampleMessage: function() {
    // let table = this.get('table');
    // let tableName = table.get('name');
    // let example = '';
    //
    //
    // if (table.get('hasQuantum')) {
    //   let quantumName = table.get('quantumName');
    //   example = `select * from ${tableName} where ${quantumName} > 1 and ${quantumName} < 100`;
    // } else {
    // }

    let temporaryExample = "select weather, temperature from GeoCheckin where time > 1234560 and time < 1234569 and region = 'South Atlantic' and state = 'South Carolina'";


    return this.set('example', temporaryExample);
  },

  didReceiveAttrs: function() {
    this.setExampleMessage();
  },

  submit() {
    let self = this;

    // Make sure the query call takes at least a second, creates a nicer UI experience
    let enforceMinDelay = new Ember.RSVP.Promise(function(resolve) { window.setTimeout(resolve, 750); });

    // Set intermediate state
    this.set('queryResultLength', null);
    this.set('queryResult', this.get('loadingMessage'));

    // Execute Query
    this.get('explorer').queryTable(this.get('table'), this.get('queryString')).then(
      function onSuccess(data) {
        enforceMinDelay.then(function() {
          if (Ember.isEmpty(data.query.rows)) {
            self.set('queryResultLength', null);
            self.set('queryResult', `No rows found on ${self.get('table').get('name')} given the statement: \n\n${self.get('queryString')}`);
          } else {
            let stringifiedData = JSON.stringify(data.query.rows);
            let formattedStringForEditor;

            // Adds a line break after each array item
            // Removes the array surrounding all the results
            // Adds a space after each comma in the array for better legibility
            formattedStringForEditor = stringifiedData.replace(/],/g, '],\n');
            formattedStringForEditor = formattedStringForEditor.substring(1, formattedStringForEditor.length-1);
            formattedStringForEditor = formattedStringForEditor.replace(/,/g, ', ');

            self.set('queryResultLength', data.query.rows.length);
            self.set('queryResult', formattedStringForEditor);
          }
        });
      }, function onFail(error) {
        self.set('queryResult', `${error.status} ${error.statusText} trying to execute statement: \n\n${self.get('queryString')}`);
      }
    );

    return false;
  },

  actions: {
    clear: function() {
      this.set('queryString', '');
      this.set('queryResult', '');
      this.set('queryResultLength', null);
    }
  }
});
