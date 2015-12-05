import { moduleForModel, test } from 'ember-qunit';

moduleForModel('cluster', 'Unit | Serializer | cluster', {
  // Specify the other units that are required for this test.
  needs: ['serializer:cluster', 'model:bucketType', 'model:riakNode']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  var record = this.subject();

  var serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
