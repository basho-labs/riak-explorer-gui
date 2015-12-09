import { moduleForModel, test } from 'ember-qunit';

moduleForModel('riak-node', 'Unit | Model | riak node', {
  needs: ['model:cluster']
});

test('it exists', function(assert) {
  var model = this.subject();
  var store = this.store();

  assert.ok(!!model);
  assert.ok(!!store);
});
