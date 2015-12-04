import { moduleForModel, test, pending } from 'ember-qunit';

moduleForModel('riak-object/map', 'Unit | Model | riak object/map', {
  needs: ['model:cluster', 'model:bucket', 'model:bucketType', 'model:objectMetadata']
});

test('it exists', function(assert) {
  let model = this.subject();
  let store = this.store();

  assert.ok(!!model);
  assert.ok(!!store);
});

pending('adding a field', function() {});

pending('removing a field', function() {});

pending('contents for display', function() {});

pending('getting fields list', function() {});

pending('getting flags list', function() {});

pending('counters', function() {});

pending('sets', function() {});

pending('registers', function() {});

pending('maps', function() {});

pending('flags', function() {});
