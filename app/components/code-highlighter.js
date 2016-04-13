import Ember from 'ember';
/* global hljs */

export default Ember.Component.extend({
  tagName: 'pre',

  classNames: ['code-highlighter'],

  didInsertElement() {
    let codeBlock = this.$().find('code')[0];

    hljs.highlightBlock(codeBlock);

    // Highlight JS is pre-pending whitespace for some reason. This removes it.
    Ember.$('.hljs').html(Ember.$.trim(Ember.$('.hljs').html()));
  }
});
