import Ember from 'ember';
import renderTooltip from 'ember-tooltips/utils/render-tooltip';
import NodeStatsHelp from '../../utils/riak-help/riak_status';

export default Ember.Component.extend({
  tagName: 'span',

  classNames: ['tooltip-icon', 'node-stats-tooltip', 'ion-information-circled'],

  itemKey: null,

  tooltipInstance: null,

  didRender: function() {
    let key  = this.get('itemKey');
    let info = NodeStatsHelp[key];

    if (info) {
      const element = this.$()[0];

      const wrapperStart = `<div class='tooltip-content-wrapper'>`;
      const title = `<div class="title-wrapper"><div class='title'>${info.name}</div></div>`;
      const desc = (info.description.length) ? `<div class="description-wrapper"><div class='description'>${info.description}</div></div>` : "";
      const example = (info.example.length) ? `<div class='example small'>Example: ${info.example}</div>` : "";
      const schema_type = (info.json_schema_type.length) ? `<div class='schema-type small'>Type: ${info.json_schema_type}</div>` : "";
      const metric_type = (info.metric_type.length) ? `<div class='metric-type small'>Metric Type: ${info.metric_type}</div>` : "";
      const period = (info.period.length) ? `<div class='period small'>Period: ${info.period}</div>` : "";
      const scope = (info.scope.length) ? `<div class='scope small'>Scope: ${info.scope}</div>` : "";
      const units = (info.units !== 'n/a') ? `<div class='units small'>Units: ${info.units}</div>` : "";
      const wrapperEnd = `</div>`;

      const toolTipTemplate =
        wrapperStart +
          title +
          desc +
          example +
          schema_type +
          metric_type +
          period +
          scope +
          units +
        wrapperEnd;

      this.set('tooltipInstance', renderTooltip(element, {
        content: toolTipTemplate,
        event: 'hover',
        typeClass: 'wide'
      }));
    }
  }
});
