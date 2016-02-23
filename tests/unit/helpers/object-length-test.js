import { objectLength } from 'ember-riak-explorer/helpers/object-length';
import { module, test } from 'qunit';

module('Unit | Helper | object length');

// Replace this with your real tests.
test('it works', function(assert) {
  let objectWithLength = {
    foo: "bar",
    haz: "cheezburger"
  };

  let objectWithOutLength = {};

  let result1 = objectLength([objectWithLength]);
  let result2 = objectLength([objectWithOutLength]);

  assert.equal(result1, 2);
  assert.equal(result2, 0);
});
