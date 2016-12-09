import Ember from 'ember';
import renderTooltip from 'ember-tooltips/utils/render-tooltip';

export default Ember.Component.extend({
  tagName: 'span',

  classNameBindings: ['toolTipClass'],

  itemKey: undefined,

  itemDescription: undefined,

  itemDefaultValue: undefined,

  itemIsEditable: undefined,

  itemSchemaType: undefined,

  tooltipInstance: null,

  shouldRenderToolTip: function() {
    let key = this.get('itemKey');
    let description = this.get('itemDescription');
    let itemDefault = this.get('itemDefaultValue');
    let editable = this.get('itemIsEditable');
    let type = this.get('itemSchemaType');

    return !!(key && (description || itemDefault || editable || type));
  }.property('itemKey', 'itemDescription', 'itemDefaultValue', 'itemIsEditable', 'itemSchemaType'),

  toolTipClass: function() {
    if (this.get('shouldRenderToolTip')) {
      return 'tooltip-icon bucket-props-tooltip ion-information-circled';
    }
  }.property('shouldRenderToolTip'),

  didRender: function() {
    if (this.get('shouldRenderToolTip')) {
      const element = this.$()[0];
      let key = this.get('itemKey');
      let description = this.get('itemDescription');
      let itemDefault = this.get('itemDefaultValue');
      let editable = this.get('itemIsEditable');
      let type = this.get('itemSchemaType');

      let wrapperStart = `<div class='tooltip-content-wrapper'>`;
      let ttTitle = `<div class='title-wrapper'><div class='title'>${key}</div></div>`;
      let ttDescription = (description !== undefined) ? `<div class='description-wrapper'><div class='description'>${description}</div></div>` : '';
      let ttItemDefault = (itemDefault !== undefined) ? `<div class='default small'>Default Value: ${itemDefault}</div>` : '';
      let ttEditable = (editable !== undefined) ? `<div class='editable small'>Editable: ${editable}</div>` : '';
      let ttType = (type !== undefined) ? `<div class='type small'>Type: ${type}</div>` : '';
      let wrapperEnd = `</div>`;

      const toolTipTemplate =
        wrapperStart +
        ttTitle +
        ttDescription +
        ttItemDefault +
        ttEditable +
        ttType +
        wrapperEnd;

      this.set('tooltipInstance', renderTooltip(element, {
        content: toolTipTemplate,
        event: 'hover'
      }));
    }
  }
});
