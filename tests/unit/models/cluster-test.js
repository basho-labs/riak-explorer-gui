import { moduleForModel, test, pending } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('cluster', 'Unit | Model | cluster', {
  needs: ['model:bucketType', 'model:riakNode', 'model:searchIndex']
});

test('it exists', function(assert) {
  let model = this.subject();
  let store = this.store();

  assert.ok(!!model);
  assert.ok(!!store);
});

test('bucketTypes relationship', function(assert) {
  let klass = this.subject({}).constructor;
  let relationship = Ember.get(klass, 'relationshipsByName').get('bucketTypes');

  assert.equal(relationship.key, 'bucketTypes');
  assert.equal(relationship.kind, 'hasMany');
});

test('riakNodes relationship', function(assert) {
  let klass = this.subject({}).constructor;
  let relationship = Ember.get(klass, 'relationshipsByName').get('riakNodes');

  assert.equal(relationship.key, 'riakNodes');
  assert.equal(relationship.kind, 'hasMany');
});

test('searchIndexes relationship', function(assert) {
  let klass = this.subject({}).constructor;
  let relationship = Ember.get(klass, 'relationshipsByName').get('searchIndexes');

  assert.equal(relationship.key, 'searchIndexes');
  assert.equal(relationship.kind, 'hasMany');
});

pending('getting active bucket types', function() {});

pending('getting inactive bucket types', function() {});

pending('determining production mode', function() {});
