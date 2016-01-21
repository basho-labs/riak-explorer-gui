import Ember from 'ember';
import WrapperState from '../../../mixins/wrapper-state';
import { module, test } from 'qunit';

module('Unit | Mixin | wrapper state');

// Replace this with your real tests.
test('it works', function(assert) {
  var SidebarSelectObject = Ember.Object.extend(WrapperState);
  var subject = SidebarSelectObject.create();
  assert.ok(subject);
});
