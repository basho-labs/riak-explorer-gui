import Ember from 'ember';

export default Ember.Controller.extend({
  errors: null,

  fileUploaded: false,

  showSpinner: false,

  validExtensions: ['proto'],

  // Each message is an object that looks like this:
  // {
  //   name: 'Some string',
  //   fields: [...],
  //   error: 'some string',
  //   success: (boolean),
  //   initialSchema: 'schema in string format',
  //   schema: 'schema in string format',
  //   showSpinner: (boolean)
  // }
  messages: [],

  actions: {
    removeSchema: function(index) {
      return this.get('messages').removeAt(index, 1);
    }
  }
});
