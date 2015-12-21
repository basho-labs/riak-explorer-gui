import DS from 'ember-data';
import objectToArray from '../../utils/riak-util';

export default DS.Model.extend({
  /**
   * Cluster the node belongs to.
   * @property cluster
   * @type DS.Model
   */
  cluster: DS.belongsTo('cluster', { async: true }),

  /**
   * Whether or not the node is available when pinged.
   *
   * @property available
   * @type Boolean
   */
  available: DS.attr('boolean', { default: false }),

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

  /**
   * All the nodes statistics. Stored as an Object hashmap.
   *
   * @property stats
   * @type Object
   */
  stats: DS.attr(),

  /**
   * All of the nodes configuration settings, stored as an array of key-value objects.
   *  ex. [{key: 'anti_entropy', value: 'active'}, {key: 'anti_entropy.bloomfilter', value: 'on'}...]
   *
   * @method configList
   * @return {Array<Object<Config>>}
   */
  configList: function() {
    let configList = [];

    if(this.get('config')) {
      configList = objectToArray(this.get('config'));
    }

    return configList;
  }.property('config'),

  /**
   * All of the nodes statistics, stored as an array of key-value objects.
   *  ex. [{key: 'asn1_version', value: '2.0.3'}, {key: 'basho_stats_version', value: '1.0.3'}...]
   *
   * @method statsList
   * @return {Array<Object<Stats>>}
   */
  statsList: function() {
    let statsList = [];

    if(this.get('stats')) {
      statsList = objectToArray(this.get('stats'));
    }

    return statsList;
  }.property('stats')
});
