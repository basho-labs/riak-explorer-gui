import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('add-custom-properties', 'Integration | Component | add custom properties', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{add-custom-properties}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#add-custom-properties}}
      template block text
    {{/add-custom-properties}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
