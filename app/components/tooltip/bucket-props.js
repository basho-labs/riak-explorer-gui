import Ember from 'ember';
import renderTooltip from 'ember-tooltips/utils/render-tooltip';
import bucketPropsHelp from '../../utils/riak-help-json/bucket_props';

export default Ember.Component.extend({
  tagName: 'span',

  classNames: ['tooltip-icon', 'bucket-props-tooltip', 'glyphicon', 'glyphicon-info-sign'],

  itemKey: null,

  tooltipInstance: null,

  didRender: function() {
    let key      = this.get('itemKey');
    let helpInfo = bucketPropsHelp[key];

    if (helpInfo) {
      const element = this.$()[0];

      const toolTipTemplate =
        `
        <div class='tooltip-content-wrapper'>
          <div class='title'>${key}</div>
          <div class='description'>${helpInfo.description}</div>
          <div class='default small'>Default Value: ${helpInfo.default}</div>
          <div class='editable small'>Editable: ${helpInfo.editable}</div>
          <div class='type small'>Type: ${helpInfo.json_schema_type}</div>
        </div>
        `;

      this.set('tooltipInstance', renderTooltip(element, {
        content: toolTipTemplate,
        event: 'hover'
      }));
    }
  }
});
