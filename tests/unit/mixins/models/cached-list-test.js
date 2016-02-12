import Ember from 'ember';
import ModelsCachedListMixin from '../../../mixins/models/cached-list';
import { module, test } from 'qunit';

module('Unit | Mixin | models/cached list');

// Replace this with your real tests.
test('it works', function(assert) {
  let ModelsCachedListObject = Ember.Object.extend(ModelsCachedListMixin);
  let subject = ModelsCachedListObject.create();
  assert.ok(subject);
});
