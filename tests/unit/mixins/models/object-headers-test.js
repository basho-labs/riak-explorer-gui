import Ember from 'ember';
import ModelsObjectHeadersMixin from '../../../mixins/models/object-headers';
import { module, test } from 'qunit';

module('Unit | Mixin | models/object headers');

// Replace this with your real tests.
test('it works', function(assert) {
  let ModelsObjectHeadersObject = Ember.Object.extend(ModelsObjectHeadersMixin);
  let subject = ModelsObjectHeadersObject.create();
  assert.ok(subject);
});
