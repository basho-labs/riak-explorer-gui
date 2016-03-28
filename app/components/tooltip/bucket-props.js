import Ember from 'ember';
import renderTooltip from 'ember-tooltips/utils/render-tooltip';

export default Ember.Component.extend({
  tagName: 'span',

  classNames: ['tooltip-icon', 'bucket-props-tooltip', 'ion-information-circled'],

  itemKey: undefined,

  itemDescription: undefined,

  itemDefaultValue: undefined,

  itemIsEditable: undefined,

  itemSchemaType: undefined,

  tooltipInstance: null,

  didRender: function() {
    let key = this.get('itemKey');

    if (key) {
      const element = this.$()[0];
      let wrapperStart = `<div class='tooltip-content-wrapper'>`;
      let title = `<div class='title-wrapper'><div class='title'>${key}</div></div>`;
      let description = (this.get('itemDescription') !== undefined) ? `<div class='description-wrapper'><div class='description'>${this.get('itemDescription')}</div></div>` : '';
      let itemDefault = (this.get('itemDefaultValue') !== undefined) ? `<div class='default small'>Default Value: ${this.get('itemDefaultValue')}</div>` : '';
      let editable = (this.get('itemIsEditable') !== undefined) ? `<div class='editable small'>Editable: ${this.get('itemIsEditable')}</div>` : '';
      let type = (this.get('itemSchemaType') !== undefined) ? `<div class='type small'>Type: ${this.get('itemSchemaType')}</div>` : '';
      let wrapperEnd = `</div>`;

      const toolTipTemplate =
        wrapperStart +
          title +
          description +
          itemDefault +
          editable +
          type +
        wrapperEnd;

      this.set('tooltipInstance', renderTooltip(element, {
        content: toolTipTemplate,
        event: 'hover'
      }));
    }
  }
});
