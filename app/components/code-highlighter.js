import Ember from 'ember';
/* global hljs */

export default Ember.Component.extend({
  tagName: 'pre',

  classNames: ['code-highlighter', 'hljs'],

  lang: null,

  code: null,

  highlight: Ember.computed('code', 'lang', function() {
    var lang = this.get('lang');
    var code = this.get('code');

    if (!lang) { throw new Error('highlight-js lang property must be set'); }
    if (!code) { return ''; } // Set empty content

    if (lang === 'auto') {
      return hljs.highlightAuto(code).value;
    } else {
      return hljs.highlight(lang, code).value;
    }
  }).readOnly()
});
