import Ember from 'ember';
import renderTooltip from 'ember-tooltips/utils/render-tooltip';
import NodeConfigHelp from '../../utils/riak-help/riak_config';

export default Ember.Component.extend({
  tagName: 'span',

  classNames: ['tooltip-icon', 'node-config-tooltip', 'glyphicon', 'glyphicon-info-sign'],

  itemKey: null,

  tooltipInstance: null,

  didRender: function() {
    let key  = this.get('itemKey');
    let info = NodeConfigHelp[key];

    if (info) {
      const element = this.$()[0];

      const wrapperStart = `<div class='tooltip-content-wrapper'>`;
      const title = `<div class="title-wrapper"><div class='title'>${key}</div></div>`;
      const desc = (info.description.length) ? `<div class="description-wrapper"><div class='description'>${info.description}</div></div>` : "";
      const example = (info.example.length) ? `<div class='example small'>Example: ${info.example}</div>` : "";
      const internal_key = (info.internal_key.length) ? `<div class='internal-key small'>Internal Key: ${info.internal_key}</div>` : "";
      const valid = (info.valid.length) ? `<div class='valid small'>Valid: ${info.valid}</div>` : "";
      const wrapperEnd = `</div>`;

      const toolTipTemplate =
        wrapperStart +
        title +
        desc +
        example +
        internal_key +
        valid +
        wrapperEnd;

      this.set('tooltipInstance', renderTooltip(element, {
        content: toolTipTemplate,
        event: 'hover',
        typeClass: 'wide'
      }));
    }
  }
});
