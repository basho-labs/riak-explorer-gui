import Ember from 'ember';
import ControllerSideDrawerMixin from 'ember-riak-explorer/mixins/controller/side-drawer';
import { module, test } from 'qunit';

module('Unit | Mixin | controller/side drawer');

// Replace this with your real tests.
test('it works', function(assert) {
  let ControllerSideDrawerObject = Ember.Object.extend(ControllerSideDrawerMixin);
  let subject = ControllerSideDrawerObject.create();
  assert.ok(subject);
});
