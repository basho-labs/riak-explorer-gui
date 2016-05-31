import Ember from 'ember';
import SideDrawer from '../../../mixins/controller/side-drawer';

export default Ember.Controller.extend(SideDrawer, {
  errors: null,

  exampleTemplate: `CREATE TABLE GeoCheckin\n(\n  region       varchar   not null,\n  state        varchar   not null,\n  time         timestamp not null,\n  PRIMARY KEY (\n    (region, state, quantum(time, 15, 'm')),\n    region, state, time\n  )\n)`,

  statement: '',

  showSpinner: false,

  isDisabled: true,

  canSubmit: function() {
    return this.set('isDisabled', Ember.isBlank(this.get('statement')));
  }.observes('statement'),

  resetState: function() {
    this.set('errors', null);
    this.set('statement', '');
  },

  actions: {
    insertTemplate: function() {
      this.set('statement', this.get('exampleTemplate'));
    }
  }
});
