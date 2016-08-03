import Ember from 'ember';
import _ from 'lodash/lodash';

export default Ember.Mixin.create({
  groupedSelectOptions: [
    {
      groupName: 'Throughput Metrics',
      options: [
        'node_gets',
        'node_puts',
        'vnode_counter_update',
        'vnode_map_update',
        'consistent_gets',
        'search_query_throughput_one',
        'search_index_throughtput_one',
        'consistent_puts',
        'vnode_index_reads'
      ]
    },
    {
      groupName: 'Latency Metrics',
      options: [
        'node_get_fsm_time_mean',
        'node_put_fsm_time_mean',
        'object_counter_merge_time_mean',
        'object_set_merge_time_mean',
        'object_map_merge_time_mean',
        'search_query_latency_median',
        'search_index_latency_median',
        'consistent_get_time_mean',
        'consistent_put_time_mean'
      ]
    },
    {
      groupName: 'Erlang Resource Usage Metrics',
      options: [
        'sys_process_count',
        'memory_processes',
        'memory_processes_used'
      ]
    },
    {
      groupName: 'General Riak Load/Health Metrics',
      options: [
        'node_get_fsm_siblings_mean',
        'node_get_fsm_objsize_mean',
        'riak_search_vnodeq_mean',
        'search_index_fail_one',
        'pbc_active',
        'pbc_connects',
        'read_repairs',
        'list_fsm_active',
        'node_get_fsm_rejected',
        'node_put_fsm_rejected'
      ]
    }
  ],
  
  setPossibleGraphOptions: function(nodeStats) {
    let groupedStats = this.get('groupedSelectOptions');
    let existingNodeStats = Object.keys(nodeStats);
    let possibleOptions;

    // Remove any groupedStatistics that the nodeStats doesn't contain
    possibleOptions = groupedStats.map(function(group) {
      group.options = _.intersection(group.options, existingNodeStats);

      return group;
    });

    // Add any number metric as a possible graph option
    possibleOptions.push({
      groupName: 'All Metrics',
      options: existingNodeStats.filter(function(stat) {
        return _.isNumber(nodeStats[stat]);
      })
    });

    this.controller.set('availableGraphs', possibleOptions);
  },

  setDefaultGraph: function() {
    let controller = this.controller;
    let firstAvailableGraph = _.head(_.head(controller.get('availableGraphs')).options);

    return controller.set('currentGraphs', [firstAvailableGraph]);
  }
});
