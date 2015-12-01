import { moduleForModel, test } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('bucket', 'Unit | Model | bucket', {
  needs: ['model:cluster', 'model:keyList', 'model:bucketType', 'model:bucketProps']
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

test('key list relationship', function(assert) {
  let klass = this.subject({}).constructor;
  let relationship = Ember.get(klass, 'relationshipsByName').get('keyList');

  assert.equal(relationship.key, 'keyList');

  assert.equal(relationship.kind, 'belongsTo');
});

test('bucket type relationship', function(assert) {
  let klass = this.subject({}).constructor;
  let relationship = Ember.get(klass, 'relationshipsByName').get('bucketType');

  assert.equal(relationship.key, 'bucketType');

  assert.equal(relationship.kind, 'belongsTo');
});

test('bucket properties relationship', function(assert) {
  let klass = this.subject({}).constructor;
  let relationship = Ember.get(klass, 'relationshipsByName').get('props');

  assert.equal(relationship.key, 'props');

  assert.equal(relationship.kind, 'belongsTo');
});
