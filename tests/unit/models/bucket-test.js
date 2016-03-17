import { moduleForModel, test } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('bucket', 'Unit | Model | bucket', {
  needs: ['model:objectList', 'model:bucketType', 'model:riakObject']
});

test('it exists', function(assert) {
  let model = this.subject();
  let store = this.store();

  assert.ok(!!model);
  assert.ok(!!store);
});

test('object list relationship', function(assert) {
  let klass = this.subject({}).constructor;
  let relationship = Ember.get(klass, 'relationshipsByName').get('objectList');

  assert.equal(relationship.key, 'objectList');

  assert.equal(relationship.kind, 'belongsTo');
});

test('bucket type relationship', function(assert) {
  let klass = this.subject({}).constructor;
  let relationship = Ember.get(klass, 'relationshipsByName').get('bucketType');

  assert.equal(relationship.key, 'bucketType');

  assert.equal(relationship.kind, 'belongsTo');
});

test('objects relationship', function(assert) {
  let klass = this.subject({}).constructor;
  let relationship = Ember.get(klass, 'relationshipsByName').get('objects');

  assert.equal(relationship.key, 'objects');

  assert.equal(relationship.kind, 'hasMany');
});
