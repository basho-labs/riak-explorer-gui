import { moduleForModel, test } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('search-index', 'Unit | Model | search index', {
  needs: ['model:cluster', 'model:searchSchema']
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

test('schema relationship', function(assert) {
  let klass = this.subject({}).constructor;
  let relationship = Ember.get(klass, 'relationshipsByName').get('schema');

  assert.equal(relationship.key, 'schema');

  assert.equal(relationship.kind, 'belongsTo');
});
