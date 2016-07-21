import DS from 'ember-data';
import _ from 'lodash/lodash';
import NodeStatsHelp from '../../utils/riak-help/riak_status';
import { storageFor } from 'ember-local-storage';

export default DS.Model.extend({
  init: function() {
    this.set('statsHistory', []);
  },

  /**
   * Cluster the node belongs to.
   * @property cluster
   * @type DS.Model
   */
  cluster: DS.belongsTo('cluster'),

  /**
   * The nodes various configuration files
   * @property configFiles
   * @type DS.Model
   */
  configFiles: DS.hasMany('config-file'),

  /**
   * The nodes various log files
   * @property logFiles
   * @type DS.Model
   */
  logFiles: DS.hasMany('log-file'),

  /**
   * Whether or not the node is available when pinged.
   *
   * @property available
   * @type Boolean
   */
  available: DS.attr('boolean', {default: false}),

  /**
   * All the nodes advanced configuration. Stored as an Array of strings.
   *  i.e ["{riak_core,[{cluster_mgr,{"127.0.0.1",8098}}]}", "{riak_repl,[{data_root,"/var/db/riak/riak_repl/"}]}"]
   *
   * @property config
   * @type Object
   */
  advancedConfig: DS.attr(),

  /**
   * All the nodes configuration settings. Stored as an Object hashmap.
   *
   * @property config
   * @type Object
   */
  config: DS.attr(),

  name: DS.attr('string'),

  replStatus: DS.attr(),

  /**
   * All the nodes statistics. Stored as an Object hashmap.
   *
   * @property stats
   * @type Object
   */
  stats: DS.attr(),

  /**
   * Array of stats property objects with an associated timestamp
   *
   * @property statsHistory
   * @type Array
   */
  statsHistory: storageFor('node-stats'),

  statsByCategory: DS.attr(),

  /**
   * Whether or not the node's ring file is "valid" or "invalid".
   *
   * @property status
   * @type String
   */
  status: DS.attr('string', {defaultValue: 'invalid'}),

  /**
   * Node health is determined by whether or not the node is available and if it's
   *  status is valid
   *
   * @method isHealthy
   * @return Boolean
   */
  isHealthy: function() {
    return !!(this.get('available') && this.get('status') === 'valid');
  }.property('available', 'status'),

  logStatHistory: function() {
    // Storing a lot of large objects, may want to only store diffs and restore when needed
    return this.get('statsHistory').pushObject({
      timestamp: Date.now(),
      stats: this.get('stats')
    });
  }.observes('stats'),

  setStatsByCategory: function() {
    if (!this.get('statsByCategory')) {
      let stats = this.get('stats');

      // Removes any key in NodeStatsHelp that is not found in stats
      let pruned = _.pick(NodeStatsHelp, Object.keys(stats));

      // Adds Current Value from stats and merges it with the appropriate key in StatsHelp
      let merged = _.forEach(pruned, function(value, key) {
          value.current_value = stats[key];

          // Stringify "disk" property so it can be displayed in the UI
          if (key === 'disk') {
            value.current_value = value.current_value.map(function(obj) {
              return JSON.stringify(obj);
            });
          }
      });

      // Groups all the keys in NodeStatsHelp by category
      let groupedBy = _.groupBy(merged, 'category');

      // Alpha-sort by category
      let sorted = {};
      Object.keys(groupedBy)
        .sort()
        .forEach(function(key) {
          sorted[key] = groupedBy[key];
        });

      return  this.set('statsByCategory', sorted);
    }
  }.observes('stats')
});
