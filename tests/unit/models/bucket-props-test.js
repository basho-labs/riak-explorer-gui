import { moduleForModel, test, pending } from 'ember-qunit';

moduleForModel('bucket-props', 'Unit | Model | bucket props', {
  needs: []
});

test('it exists', function(assert) {
  let model = this.subject();
  let store = this.store();

  assert.ok(!!model);
  assert.ok(!!store);
});

pending('propsList', function() {
});

pending('dataTypeName ', function() {
});

pending('resolutionStrategy ', function() {
});

pending('objectType ', function() {
});

pending('quorumRelevant ', function() {
});

pending('warnings ', function() {
});
