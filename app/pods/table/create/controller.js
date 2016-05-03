import Ember from 'ember';

export default Ember.Controller.extend({
  errors: null,

  exampleTemplate: `CREATE TABLE GeoCheckin\n(\n  region       varchar   not null,\n  state        varchar   not null,\n  time         timestamp not null,\n  weather      varchar   not null,\n  temperature  double,\n  PRIMARY KEY (\n    (region, state, quantum(time, 15, 'm')),\n    region, state, time\n  )\n)`,

  statement: '',

  showSpinner: false,

  helpVisibile: false,

  isDisabled: true,

  canSubmit: function() {
    return this.set('isDisabled', Ember.isBlank(this.get('statement')));
  }.observes('statement'),

  resetState: function() {
    this.set('errors', null);
    this.set('statement', '');
  },

  actions: {
    removeHelp: function() {
      this.set('helpVisibile', false);
    },

    showHelp: function() {
      this.set('helpVisibile', true);
    },

    insertTemplate: function() {
      this.set('statement', this.get('exampleTemplate'));
    }
  }
});
