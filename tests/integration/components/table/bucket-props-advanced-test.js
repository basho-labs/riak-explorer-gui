import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('table/bucket-props-advanced', 'Integration | Component | table/bucket props advanced', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{table/bucket-props-advanced}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#table/bucket-props-advanced}}
      template block text
    {{/table/bucket-props-advanced}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
