import Ember from 'ember';

export default Ember.Mixin.create({
  /**
   * Has the cached list been loaded from the server?
   *
   * @property isListLoaded
   * @type Boolean
   * @default false
   */
  isListLoaded: DS.attr('boolean', {defaultValue: false}),

  /**
   * Status message to display to the user. Relevant for long-running
   * server operations such as loading large lists or refreshing cached lists.
   * Sample messages:
   *
   *  - 'Requesting cached list...'
   *  - 'Cache not found. Refreshing from a streaming list keys/buckets call...'
   * @property statusMessage
   * @type String
   */
  statusMessage: DS.attr('string', {defaultValue: 'Requesting cached list...'})
});
