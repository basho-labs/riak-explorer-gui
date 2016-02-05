import Ember from 'ember';

/**
 * Mixin class that allows routes to render an alert template into the alert outlet.
 * To be used on route classes only.
 *
 * @class WrapperState
 */
export default Ember.Mixin.create({
  /**
   * Renders the passed template into the alert outlet.
   * @method showAlert
   * @argument String
   */
  showAlert(templateString) {
    this.render(templateString, {
      into: 'application',
      outlet: 'alert'
    });
  },

  /**
   * Renders and empty template into the alerts outlet. Useful for removing any existing
   *  alerts that are currently in view.
   * @method removeAlert
   */
  removeAlert() {
    this.render('alerts.empty', {
      into: 'application',
      outlet: 'alert'
    });
  }
});
