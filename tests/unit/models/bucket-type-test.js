import { moduleForModel, test } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('bucket-type', 'Unit | Model | bucket type', {
  needs: ['model:cluster', 'model:bucketList', 'model:bucket']
});

test('it exists', function(assert) {
  let model = this.subject();
  let store = this.store();

  assert.ok(!!model);
  assert.ok(!!store);
});

test('cluster relationship', function(assert) {
  let klass = this.subject({}).constructor;
  let relationship = Ember.get(klass, 'relationshipsByName').get('cluster');

  assert.equal(relationship.key, 'cluster');

  assert.equal(relationship.kind, 'belongsTo');
});

test('bucket lists relationship', function(assert) {
  let klass = this.subject({}).constructor;
  let relationship = Ember.get(klass, 'relationshipsByName').get('bucketList');

  assert.equal(relationship.key, 'bucketList');

  assert.equal(relationship.kind, 'belongsTo');
});

test('buckets relationship', function(assert) {
  let klass = this.subject({}).constructor;
  let relationship = Ember.get(klass, 'relationshipsByName').get('buckets');

  assert.equal(relationship.key, 'buckets');
  assert.equal(relationship.kind, 'hasMany');
});
