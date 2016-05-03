import Ember from 'ember';

export default Ember.Controller.extend({
  example: "",

  query: '',

  result: '',

  resultLength: null,

  isDisabled: true,

  isLoading: false,

  showClear: false,

  canClear: function() {
    let result = this.get('result');
    let canClear = Ember.isPresent(result) && result !== this.get('loadingMessage');

    this.set('showClear', canClear);
  }.observes('result'),

  canSubmit: function() {
    return this.set('isDisabled', Ember.isBlank(this.get('query')));
  }.observes('query'),

  setLoadingState: function() {
    if (this.get('isLoading')) {
      this.set('resultLength', null);
      this.set('result', 'Querying...');
    }
  }.observes('isLoading'),

  resetResult: function() {
    this.set('result', '');
    this.set('resultLength', null);
  },

  resetQuery: function() {
    this.set('query', '');
  },

  resetState: function() {
    this.resetQuery();
    this.resetResult();
  },

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

  actions: {
    clear: function() {
      this.resetState();
    }
  }
});
