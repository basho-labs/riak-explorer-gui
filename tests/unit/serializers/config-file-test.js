import { moduleForModel, test } from 'ember-qunit';

moduleForModel('config-file', 'Unit | Serializer | config file', {
  // Specify the other units that are required for this test.
  needs: ['serializer:config-file', 'model:node']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
