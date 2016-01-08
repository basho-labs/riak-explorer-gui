import { moduleForModel, test } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('config-file', 'Unit | Model | config file', {
  needs: ['model:node']
});

test('it exists', function(assert) {
  let model = this.subject();
  let store = this.store();

  assert.ok(!!model);
  assert.ok(!!store);
});

test('node relationship', function(assert) {
  let klass = this.subject({}).constructor;
  let relationship = Ember.get(klass, 'relationshipsByName').get('node');

  assert.equal(relationship.key, 'node');
  assert.equal(relationship.kind, 'belongsTo');
});
