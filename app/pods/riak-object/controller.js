import Ember from 'ember';

export default Ember.Controller.extend({
  loadingMessage: 'Attempting request...',

  showLoadingSpinner: false,

  stringifiedContents: '',

  updateStringifiedContents: function() {
    if (this.get('contentTypeLanguage') === 'javascript') {
      return this.set('stringifiedContents', JSON.stringify(this.get('contents'), null, ' '));
    }
  }.observes('contents'),

  updateContents: function() {
    if (this.get('contentTypeLanguage') === 'javascript') {
      return this.set('contents', JSON.parse(this.get('stringifiedContents')));
    }
  }.observes('stringifiedContents')
});
