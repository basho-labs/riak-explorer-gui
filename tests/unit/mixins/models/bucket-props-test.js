import Ember from 'ember';
import ModelsBucketPropsMixin from '../../../mixins/models/bucket-props';
import { module, test } from 'qunit';

module('Unit | Mixin | models/bucket props');

// Replace this with your real tests.
test('it works', function(assert) {
  let ModelsBucketPropsObject = Ember.Object.extend(ModelsBucketPropsMixin);
  let subject = ModelsBucketPropsObject.create();
  assert.ok(subject);
});
