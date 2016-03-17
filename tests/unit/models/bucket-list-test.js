import { moduleForModel, test } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('bucket-list', 'Unit | Model | bucket list', {
  needs: ['model:bucketType']
});

test('it exists', function(assert) {
  let model = this.subject();
  let store = this.store();

  assert.ok(!!model);
  assert.ok(!!store);
});

test('bucket type relationship', function(assert) {
  let klass = this.subject({}).constructor;
  let relationship = Ember.get(klass, 'relationshipsByName').get('bucketType');

  assert.equal(relationship.key, 'bucketType');

  assert.equal(relationship.kind, 'belongsTo');
});
