import Ember from 'ember';
import EmberUploader from 'ember-uploader';

export default EmberUploader.FileField.extend({
  // Leave blank to allow any extension type
  validExtensions: [],

  uploader: null,

  hasCorrectExtension: function(filename) {
    let validExtensions = this.get('validExtensions');

    if (Ember.isEmpty(validExtensions)) {
      return true;
    } else {
      let extensionName = filename.split('.').pop();

      return validExtensions.indexOf(extensionName) !== -1;
    }
  },

  didReceiveAttrs: function() {
    this._super(...arguments);
    this.set('uploader', EmberUploader.Uploader.create({
      url: this.get('url')
    }));
  },

  filesDidChange: function(files) {
    let uploader = this.get('uploader');
    let self = this;

    if (!Ember.isEmpty(files)) {
      let file = files[0];

      if (this.hasCorrectExtension(file.name)) {
        uploader.upload(files[0]).then(
          function(data) {
            self.sendAction('onUploadSuccess', data);
          }, function(error) {
            self.sendAction('onUploadFail', error);
          }
        );
      } else {
        this.sendAction('onIncorrectExtension');
      }
    }
  }
});
