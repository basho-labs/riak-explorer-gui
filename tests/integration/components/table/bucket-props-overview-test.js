import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('table/bucket-props-overview', 'Integration | Component | table/bucket props overview', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{table/bucket-props-overview}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#table/bucket-props-overview}}
      template block text
    {{/table/bucket-props-overview}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
