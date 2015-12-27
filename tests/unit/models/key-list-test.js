import { moduleForModel, test, pending  } from 'ember-qunit';

moduleForModel('key-list', 'Unit | Model | key list', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function(assert) {
  var model = this.subject();
  var store = this.store();
  assert.ok(!!model);
  assert.ok(!!store);
});

pending('showDeleteKeys', function() {
});
