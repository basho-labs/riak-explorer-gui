import Ember from 'ember';
import ComponentScrollResetMixin from 'ember-riak-explorer/mixins/component/scroll-reset';
import { module, test } from 'qunit';

module('Unit | Mixin | component/scroll reset');

// Replace this with your real tests.
test('it works', function(assert) {
  let ComponentScrollResetObject = Ember.Object.extend(ComponentScrollResetMixin);
  let subject = ComponentScrollResetObject.create();
  assert.ok(subject);
});
