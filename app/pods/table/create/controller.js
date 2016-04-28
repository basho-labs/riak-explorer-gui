import Ember from 'ember';

export default Ember.Controller.extend({
  errors: [],

  exampleTemplate: `CREATE TABLE GeoCheckin\n(\n  region       varchar   not null,\n  state        varchar   not null,\n  time         timestamp not null,\n  weather      varchar   not null,\n  temperature  double,\n  PRIMARY KEY (\n    (region, state, quantum(time, 15, 'm')),\n    region, state, time\n  )\n)`,

  statement: ''

});
