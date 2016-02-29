import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('tooltip/node-config', 'Integration | Component | tooltip/node config', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{tooltip/node-config}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#tooltip/node-config}}
      template block text
    {{/tooltip/node-config}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
