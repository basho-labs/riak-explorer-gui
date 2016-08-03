import Ember from 'ember';
import RoutesMonitoringMixin from 'ember-riak-explorer/mixins/routes/monitoring';
import { module, test } from 'qunit';

module('Unit | Mixin | routes/monitoring');

// Replace this with your real tests.
test('it works', function(assert) {
  let RoutesMonitoringObject = Ember.Object.extend(RoutesMonitoringMixin);
  let subject = RoutesMonitoringObject.create();
  assert.ok(subject);
});
