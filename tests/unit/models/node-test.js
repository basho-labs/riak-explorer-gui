import { moduleForModel, test } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('node', 'Unit | Model | node', {
  needs: ['model:cluster', 'model:log-file']
});

test('it exists', function(assert) {
  var model = this.subject();
  var store = this.store();

  assert.ok(!!model);
  assert.ok(!!store);
});

test('cluster relationship', function(assert) {
  let klass = this.subject({}).constructor;
  let relationship = Ember.get(klass, 'relationshipsByName').get('cluster');

  assert.equal(relationship.key, 'cluster');
  assert.equal(relationship.kind, 'belongsTo');
});

test('log files relationship', function(assert) {
  let klass = this.subject({}).constructor;
  let relationship = Ember.get(klass, 'relationshipsByName').get('logFiles');

  assert.equal(relationship.key, 'logFiles');
  assert.equal(relationship.kind, 'hasMany');
});

