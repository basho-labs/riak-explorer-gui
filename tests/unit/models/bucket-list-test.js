import { moduleForModel, test, pending } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('bucket-list', 'Unit | Model | bucket list', {
  needs: ['model:cluster', 'model:bucketType']
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

test('bucket type relationship', function (assert) {
  let klass = this.subject({}).constructor;
  let relationship = Ember.get(klass, 'relationshipsByName').get('bucketType');

  assert.equal(relationship.key, 'bucketType');

  assert.equal(relationship.kind, 'belongsTo');
});

pending('bucket type id', function() {});

pending('cluster id', function() {});
