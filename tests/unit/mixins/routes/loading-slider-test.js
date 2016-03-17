import Ember from 'ember';
import RoutesLoadingSliderMixin from 'ember-riak-explorer/mixins/routes/loading-slider';
import { module, test } from 'qunit';

module('Unit | Mixin | routes/loading slider');

// Replace this with your real tests.
test('it works', function(assert) {
  let RoutesLoadingSliderObject = Ember.Object.extend(RoutesLoadingSliderMixin);
  let subject = RoutesLoadingSliderObject.create();
  assert.ok(subject);
});
