import { moduleForModel, test } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('search-schema', 'Unit | Model | pb-file', {
  // Specify the other units that are required for this test.
  needs: ['model:cluster']
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
