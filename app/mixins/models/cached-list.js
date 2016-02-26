import DS from 'ember-data';
import Ember from 'ember';

export default Ember.Mixin.create({
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
   * @method hasMultipleListItems
   * @returns Boolean
   */
  hasMultipleListItems: function() {
    return this.get('count') > 1;
  }.property('count')
});
