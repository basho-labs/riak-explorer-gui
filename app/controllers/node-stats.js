import Ember from 'ember';

export default Ember.Controller.extend({
    queryParams: ['nodeId', 'clusterId'],
    nodeId: null,
    clusterId: null
});
