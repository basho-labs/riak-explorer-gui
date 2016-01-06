import { moduleForModel, test } from 'ember-qunit';

moduleForModel('log-file', 'Unit | Serializer | log file', {
  // Specify the other units that are required for this test.
  needs: ['serializer:log-file', 'model:node']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
