import DS from 'ember-data';

export default DS.Model.extend({
  /**
   * Node the log file belongs to.
   * @property node
   * @type DS.Model
   */
  node: DS.belongsTo('node'),

  /**
   * Contents of the node file so they can be displayed in the ui. will be limited to the amount of
   *  lines specified in this.get('pageSize').
   *
   * @property content
   * @type String
   */
  content: DS.attr('string'),

  /**
   * The name of the file. The actual id is a composite id (i.e. cluster1/node1/file1.log).
   *
   * @property name
   * @type String
   */
  name: DS.attr('string'),

  /**
   * Tracks the state of whether the model is refetching this.get('content').
   *
   * @property isRefreshing
   * @type Boolean
   */
  isRefreshing: DS.attr('boolean', {default: false}),

  /**
   * The max number of lines fetched in the request for this.get('content').
   *
   * @property pageSize
   * @type Integer
   */
  pageSize: DS.attr('number', {default: 0}),

  /**
   * The total number of lines in the file.
   *
   * @property totalLines
   * @type Integer
   */
  totalLines: DS.attr('number', {default: 0}),

  /**
   * Calculates whether there are more lines than the requested page size. Returns a
   * Boolean Value.
   *
   * @method moreLinesThanPageSize
   * @returns Boolean
   */
  moreLinesThanPageSize: function() {
    return this.get('pageSize') < this.get('totalLines');
  }.property('pageSize', 'totalLines')
});
