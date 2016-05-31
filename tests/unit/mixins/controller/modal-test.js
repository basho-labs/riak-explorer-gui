import Ember from 'ember';
import ControllerModalMixin from 'ember-riak-explorer/mixins/controller/modal';
import { module, test } from 'qunit';

module('Unit | Mixin | controller/modal');

// Replace this with your real tests.
test('it works', function(assert) {
  let ControllerModalObject = Ember.Object.extend(ControllerModalMixin);
  let subject = ControllerModalObject.create();
  assert.ok(subject);
});
