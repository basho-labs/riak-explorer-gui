import DS from 'ember-data';

/**
 * Represents a key list or a bucket list that's cached on disk by Explorer API.
 *
 * @class CachedList
 * @extends DS.Model
 * @constructor
 */
var CachedList = DS.Model.extend({
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
  cachePresent: DS.attr('boolean', {defaultValue: true}),

  /**
   * Number of items displayed on the current page of the list
   * @property count
   * @type Number
   * @default 0
   */
  count: DS.attr('number', {defaultValue: 0}),

  /**
   * Timestamp of when the cached list was generated on the server side
   * @property created
   * @type String
   */
  created: DS.attr(),

  /**
   * Is the List operation waiting for a cache to be generated?
   * @property isLoaded
   * @type Boolean
   * @default false
   */
  isLoaded: DS.attr('boolean', {defaultValue: false}),

  /**
   * The index of the first item in the current page, in relation to the entire list
   * @property firstItemIndex
   * @type Integer
   */
  firstItemIndex: DS.attr('number', {defaultValue: 1}),

  /**
   * The number of items per page
   * @property pageSize
   * @type Integer
   */
  pageSize: DS.attr('number', {defaultValue: 0}),

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
  statusMessage: DS.attr('string', {defaultValue: 'Requesting cached list...'}),

  /**
   * Total number of items in the cached list on the API side.
   * @property total
   * @type Number
   * @default 0
   */
  total: DS.attr('number', {defaultValue: 0}),

  /**
   * The index of the last item in the current page, in relation to the entire list
   *
   * @method lastItemIndex
   * @returns Integer
   */
  lastItemIndex: function() {
    return this.get('firstItemIndex') + this.get('count') - 1;
  }.property('firstItemIndex', 'count'),

  /**
   * Whether or not the current page has more than 1 item in it
   *
   * @method lastItemIndex
   * @returns Boolean
   */
  multipleListItems: function() {
    return this.get('count') > 1;
  }.property('count')
});

export default CachedList;
