import { moduleForModel, test, pending } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('riak-object', 'Unit | Model | riak object', {
  needs: ['model:cluster', 'model:bucket', 'model:bucketType', 'model:objectMetadata']
});

test('it exists', function(assert) {
  let model = this.subject();
  let store = this.store();

  assert.ok(!!model);
  assert.ok(!!store);
});

test('cluster relationship', function (assert) {
  let klass = this.subject({}).constructor;
  let relationship = Ember.get(klass, 'relationshipsByName').get('cluster');

  assert.equal(relationship.key, 'cluster');

  assert.equal(relationship.kind, 'belongsTo');
});

test('bucket types relationship', function (assert) {
  let klass = this.subject({}).constructor;
  let relationship = Ember.get(klass, 'relationshipsByName').get('bucketType');

  assert.equal(relationship.key, 'bucketType');

  assert.equal(relationship.kind, 'belongsTo');
});

test('bucket relationship', function (assert) {
  let klass = this.subject({}).constructor;
  let relationship = Ember.get(klass, 'relationshipsByName').get('bucket');

  assert.equal(relationship.key, 'bucket');

  assert.equal(relationship.kind, 'belongsTo');
});

test('metadata relationship', function (assert) {
  let klass = this.subject({}).constructor;
  let relationship = Ember.get(klass, 'relationshipsByName').get('metadata');

  assert.equal(relationship.key, 'metadata');

  assert.equal(relationship.kind, 'belongsTo');
});

pending('contents for display', function () {});

