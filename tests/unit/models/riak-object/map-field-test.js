import { moduleForModel, test, pending } from 'ember-qunit';

moduleForModel('riak-object/map-field', 'Unit | Model | riak object/map field', {
  needs: ['model:cluster', 'model:bucket', 'model:bucketType', 'model:objectMetadata']
});

test('it exists', function(assert) {
  let model = this.subject();
  let store = this.store();

  assert.ok(!!model);
  assert.ok(!!store);
});

pending('adding a new element', function() {
});

pending('getting the full name', function() {
});

pending('normalizing the name', function() {
});

pending('removeElement', function() {
});

pending('value for display', function() {
});
