import Ember from 'ember';

/**
 Implements Bootstrap alerts, see http://getbootstrap.com/components/#alerts

 By default it is a user dismissible, which can be disabled. Be sure to set the `type` property for proper styling.

 ```hbs
 {{#alert-component type="success"}}
 <strong>Well done!</strong> You successfully read this important alert message.
 {{/alert-component}}
 ```
 @class Alert
 @namespace Components
 @extends Ember.Component
 */

export default Ember.Component.extend({
  classNameBindings: ['alert'],

  type: 'info',

  /**
   * A dismissible alert will have a close button in the upper right corner, that the user can click to dismiss
   * the alert.
   *
   * @property dismissible
   * @type boolean
   * @default true
   * @public
   */
  dismissible: true,

  /**
   * This property indicates if the alert is visible. Can be set to change the visibility of the alert box.
   *
   * @property visible
   * @type boolean
   * @default true
   * @public
   */
  visible: true,

  alert: function() {
    if (this.get('visible')) {
      return `alert alert-${this.get('type')}`;
    }
  }.property('type', 'visible'),

  onVisibleChange: function() {
    if (this.get('visible')) {
      this.show();
    }
    else {
      this.hide();
    }
  }.property('visible'),

  /**
   * Call to make the alert visible again after it has been hidden
   *
   * @method show
   * @public
   */
  show: function() {
    this.set('visible', true);
  },

  /**
   * Call to hide the alert.
   *
   * @method hide
   * @public
   */
  hide: function() {
    this.set('visible', false);
  },

  actions: {
    dismiss: function() {
      this.hide();
    }
  }
});
