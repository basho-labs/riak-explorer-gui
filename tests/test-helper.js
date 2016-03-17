import resolver from './helpers/resolver';
import QU from 'ember-qunit';

/**
* Basic helper function to mark tests as pending.
* NOTE: This still marks the test as passed. It does style the output in the browser.
*       No phantomJS support as of right now.
*
* @method pending
*/
QU.pending = function() {
  QU.test(arguments[0] + ' (PENDING TEST)', function(assert) {
    assert.ok(!0); //dont expect any tests

    $('.running').css('background', '#FFFF99');
  });
};

QU.setResolver(resolver);
