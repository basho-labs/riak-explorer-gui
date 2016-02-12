import Ember from 'ember';

export default Ember.Mixin.create({
  /**
   * Is an API-side cache present, for this list?
   * In Development Mode, if a cache is not present, the client will
   * automatically kick off a cache refresh (from a streaming list keys, for
   * example).
   * In Production Mode, if there is no cache, an appropriate message will
   * be displayed.
   * @property cachePresent
   * @type Boolean
   * @default true
   */
  //cachePresent: DS.attr('boolean', {defaultValue: true}),

  /**
   * Number of items displayed on the current page of the list
   * @property count
   * @type Number
   * @default 0
   */
  listCount: DS.attr('number', {defaultValue: 0}),

  /**
   * Timestamp of when the cached list was generated on the server side
   * @property created
   * @type String
   */
  listCreatedAt: DS.attr(),

  /**
   * Is the List operation waiting for a cache to be generated?
   * @property isLoaded
   * @type Boolean
   * @default false
   */
  listIsLoaded: DS.attr('boolean', {defaultValue: false}),

  /**
   * The index of the first item in the current page, in relation to the entire list
   * @property firstItemIndex
   * @type Integer
   */
  listFirstItemIndex: DS.attr('number', {defaultValue: 1}),

  /**
   * The number of items per page
   * @property pageSize
   * @type Integer
   */
  listPageSize: DS.attr('number', {defaultValue: 0}),

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
  listStatusMessage: DS.attr('string', {defaultValue: 'Requesting cached list...'}),

  /**
   * Total number of items in the cached list on the API side.
   * @property total
   * @type Number
   * @default 0
   */
  listTotalSize: DS.attr('number', {defaultValue: 0}),

  /**
   * The index of the last item in the current page, in relation to the entire list
   *
   * @method lastItemIndex
   * @returns Integer
   */
  listLastItemIndex: function() {
    return this.get('firstItemIndex') + this.get('count') - 1;
  }.property('firstItemIndex', 'count'),

  /**
   * Whether or not the current page has more than 1 item in it
   *
   * @method lastItemIndex
   * @returns Boolean
   */
  listHasMultipleListItems: function() {
    return this.get('count') > 1;
  }.property('count')
});
