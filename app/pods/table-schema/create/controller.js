import Ember from 'ember';

export default Ember.Controller.extend({
  errors: null,

  fileUploaded: false,

  showSpinner: false,

  validExtensions: ['proto'],

  parsedContents: ''
});
