import { moduleForModel, test } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('node', 'Unit | Model | node', {
  needs: [
    'model:cluster',
    'model:log-file',
    'model:config-file'
  ]
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

test('log files relationship', function(assert) {
  let klass = this.subject({}).constructor;
  let relationship = Ember.get(klass, 'relationshipsByName').get('logFiles');

  assert.equal(relationship.key, 'logFiles');
  assert.equal(relationship.kind, 'hasMany');
});

test('config files relationship', function(assert) {
  let klass = this.subject({}).constructor;
  let relationship = Ember.get(klass, 'relationshipsByName').get('configFiles');

  assert.equal(relationship.key, 'configFiles');
  assert.equal(relationship.kind, 'hasMany');
});

test('isHealthy', function(assert) {
  let model = this.subject();

  Ember.run(function() {
    model.set('available', true).set('status', 'valid');
    assert.equal(model.get('isHealthy'), true);

    model.set('available', false).set('status', 'valid');
    assert.equal(model.get('isHealthy'), false);

    model.set('available', true).set('status', 'invalid');
    assert.equal(model.get('isHealthy'), false);
  });
});
