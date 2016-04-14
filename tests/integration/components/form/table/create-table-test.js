import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('form/table/create-table', 'Integration | Component | form/table/create table', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{form/table/create-table}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#form/table/create-table}}
      template block text
    {{/form/table/create-table}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
