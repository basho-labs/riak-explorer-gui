import { moduleForModel, test, pending } from 'ember-qunit';

moduleForModel('riak-object/set', 'Unit | Model | riak object/set', {
  needs: ['model:cluster', 'model:bucket', 'model:bucketType', 'model:objectMetadata']
});

test('it exists', function(assert) {
  let model = this.subject();
  let store = this.store();

  assert.ok(!!model);
  assert.ok(!!store);
});

pending('adding an element', function() {});

pending('removing an element', function() {});
