import { moduleForModel, test, pending } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('riak-object', 'Unit | Model | riak object', {
  needs: ['model:bucket']
});

test('it exists', function(assert) {
  let model = this.subject();
  let store = this.store();

  assert.ok(!!model);
  assert.ok(!!store);
});

test('bucket relationship', function(assert) {
  let klass = this.subject({}).constructor;
  let relationship = Ember.get(klass, 'relationshipsByName').get('bucket');

  assert.equal(relationship.key, 'bucket');

  assert.equal(relationship.kind, 'belongsTo');
});

pending('contents for display', function() {
});

