import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('table/bucket-types', 'Integration | Component | table/bucket types', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{tables/bucket-types}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#tables/bucket-types}}
      template block text
    {{/tables/bucket-types}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
