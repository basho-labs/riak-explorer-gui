import DS from 'ember-data';

export default DS.Model.extend({
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

  /**
   * All the nodes statistics. Stored as an Object hashmap.
   *
   * @property stats
   * @type Object
   */
  stats: DS.attr(),

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
  }.property('available', 'status')
});
