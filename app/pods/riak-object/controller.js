import Ember from 'ember';

export default Ember.Controller.extend({
  loadingMessage: 'Attempting request...',

  showLoadingSpinner: false,

  stringifiedContents: ''
});
