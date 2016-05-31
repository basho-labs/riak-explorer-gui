import Ember from 'ember';
import RoutesPollingMixin from 'ember-riak-explorer/mixins/routes/polling';
import { module, test } from 'qunit';

module('Unit | Mixin | routes/polling');

// Replace this with your real tests.
test('it works', function(assert) {
  let RoutesPollingObject = Ember.Object.extend(RoutesPollingMixin);
  let subject = RoutesPollingObject.create();
  assert.ok(subject);
});
