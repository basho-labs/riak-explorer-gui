import Ember from 'ember';
import RoutesScrollResetMixin from 'ember-riak-explorer/mixins/routes/scroll-reset';
import { module, test } from 'qunit';

module('Unit | Mixin | routes/scroll reset');

// Replace this with your real tests.
test('it works', function(assert) {
  let RoutesScrollResetObject = Ember.Object.extend(RoutesScrollResetMixin);
  let subject = RoutesScrollResetObject.create();
  assert.ok(subject);
});
