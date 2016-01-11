import { moduleForModel, test, pending } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('cluster', 'Unit | Model | cluster', {
  needs: [
    'model:bucketType',
    'model:node',
    'model:searchIndex',
    'model:searchSchema',
    'model:config-file',
    'model:log-file'
  ]
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

test('nodes relationship', function(assert) {
  let klass = this.subject({}).constructor;
  let relationship = Ember.get(klass, 'relationshipsByName').get('nodes');

  assert.equal(relationship.key, 'nodes');
  assert.equal(relationship.kind, 'hasMany');
});

test('searchIndexes relationship', function(assert) {
  let klass = this.subject({}).constructor;
  let relationship = Ember.get(klass, 'relationshipsByName').get('searchIndexes');

  assert.equal(relationship.key, 'searchIndexes');
  assert.equal(relationship.kind, 'hasMany');
});

test('searchSchemas relationship', function(assert) {
  let klass = this.subject({}).constructor;
  let relationship = Ember.get(klass, 'relationshipsByName').get('searchSchemas');

  assert.equal(relationship.key, 'searchSchemas');
  assert.equal(relationship.kind, 'hasMany');
});

pending('getting active bucket types', function() {
});

pending('getting inactive bucket types', function() {
});

pending('determining production mode', function() {
});

test('status', function(assert) {
  let model = this.subject();
  let store = this.store();

  Ember.run(function() {
    // No nodes should return down
    assert.equal(model.get('status'), 'down');

    // Create some mock nodes
    let node1 = store.createRecord('node', { id: 'node1', cluster: model });
    let node2 = store.createRecord('node', { id: 'node2', cluster: model });
    let node3 = store.createRecord('node', { id: 'node3', cluster: model });

    node1.set('available', true).set('status', 'valid');
    node2.set('available', true).set('status', 'valid');
    node3.set('available', true).set('status', 'valid');
    assert.equal(model.get('status'), 'ok');

    node1.set('available', false).set('status', 'valid');
    node2.set('available', false).set('status', 'invalid');
    node3.set('available', false).set('status', 'valid');
    assert.equal(model.get('status'), 'down');

    node1.set('available', true).set('status', 'valid');
    node2.set('available', false).set('status', 'invalid');
    node3.set('available', false).set('status', 'valid');
    assert.equal(model.get('status'), 'warning');
  });
});
