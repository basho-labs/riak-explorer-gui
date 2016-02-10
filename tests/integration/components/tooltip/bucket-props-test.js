import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('tooltip/bucket-props', 'Integration | Component | tooltip/bucket props', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{tooltip/bucket-props}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#tooltip/bucket-props}}
      template block text
    {{/tooltip/bucket-props}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
