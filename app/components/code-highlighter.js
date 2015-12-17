import Ember from 'ember';
/* global hljs */

export default Ember.Component.extend({
    tagName: 'pre',

    classNames: ['code-highlighter'],

    didRender() {
        let codeBlock = this.$().find('code')[0];

        hljs.highlightBlock(codeBlock);
    }
});
