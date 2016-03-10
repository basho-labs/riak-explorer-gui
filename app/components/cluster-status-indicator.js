import Ember from 'ember';
import renderTooltip from 'ember-tooltips/utils/render-tooltip';

export default Ember.Component.extend({
  tagName: 'span',

  classNames: ['cluster-status-circle'],

  classNameBindings: ['status'],

  status: null,

  tooltipInstance: null,

  toolTipContent: function() {
    let message = '';
    let status = this.get('status');

    switch (status) {
      case 'ok':
        message = "All nodes in the cluster are valid and are reachable";
        break;
      case 'warning':
        message = 'Some nodes in the cluster are either invalid and/or are unreachable';
        break;
      case 'down':
        message = 'All nodes in the cluster are either invalid and/or are unreachable';
        break;
      default:
        break;
    }

    return `<div class='tooltip-content-wrapper'>${message}</div>`;
  }.property('status'),

  didRender: function() {
    let toolTipContent = this.get('toolTipContent');

    if (!this.get('tooltipInstance')) {
      const element = this.$()[0];

      this.set('tooltipInstance', renderTooltip(element, {
        content: toolTipContent,
        event: 'hover',
        place: 'right',
        spacing: 20
      }));
    } else {
      this.get('tooltipInstance').content(toolTipContent);
    }
  }
});
