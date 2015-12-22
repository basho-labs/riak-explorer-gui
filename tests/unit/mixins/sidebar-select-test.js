import Ember from 'ember';
import SidebarSelectMixin from '../../../mixins/sidebar-select';
import { module, test } from 'qunit';

module('Unit | Mixin | sidebar select');

// Replace this with your real tests.
test('it works', function(assert) {
  var SidebarSelectObject = Ember.Object.extend(SidebarSelectMixin);
  var subject = SidebarSelectObject.create();
  assert.ok(subject);
});
