import DS from 'ember-data';
import Ember from "ember";

var ApplicationAdapter = DS.RESTAdapter.extend({
    namespace:  'explore'
});

export default ApplicationAdapter;
