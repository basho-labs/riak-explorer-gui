import { moduleForModel, test, pending } from 'ember-qunit';

moduleForModel('riak-object/counter', 'Unit | Model | riak object/counter', {
  needs: ['model:cluster', 'model:bucket', 'model:bucketType', 'model:objectMetadata']
});

test('it exists', function(assert) {
  let model = this.subject();
  let store = this.store();

  assert.ok(!!model);
  assert.ok(!!store);
});

pending('Decreasing the counter value', function() {
});

pending('Increasing the counter value', function() {
});
