import { moduleForModel, test, pending } from 'ember-qunit';

moduleForModel('riak-object/embedded-map', 'Unit | Model | riak object/embedded map', {
  needs: ['model:cluster', 'model:bucket', 'model:bucketType', 'model:objectMetadata']
});

test('it exists', function(assert) {
  let model = this.subject();
  let store = this.store();

  assert.ok(!!model);
  assert.ok(!!store);
});

pending('counter values', function() {});

pending('flags values', function() {});

pending('maps values', function() {});

pending('register values', function() {});

pending('sets values', function() {});
