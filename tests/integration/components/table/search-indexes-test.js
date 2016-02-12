import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('table/search-indexes', 'Integration | Component | table/search indexes', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{table/search-indexes}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#table/search-indexes}}
      template block text
    {{/table/search-indexes}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
