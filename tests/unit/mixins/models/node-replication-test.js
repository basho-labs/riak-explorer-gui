import Ember from 'ember';
import ModelsNodeReplicationMixin from 'ember-riak-explorer/mixins/models/node-replication';
import { module, test } from 'qunit';

module('Unit | Mixin | models/node replication');

// Replace this with your real tests.
test('it works', function(assert) {
  let ModelsNodeReplicationObject = Ember.Object.extend(ModelsNodeReplicationMixin);
  let subject = ModelsNodeReplicationObject.create();
  assert.ok(subject);
});
