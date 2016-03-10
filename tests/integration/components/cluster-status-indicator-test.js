import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('cluster-status-indicator', 'Integration | Component | cluster status indicator', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{cluster-status-indicator}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#cluster-status-indicator}}
      template block text
    {{/cluster-status-indicator}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
