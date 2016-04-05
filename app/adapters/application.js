import DS from 'ember-data';
import Ember from "ember";
import config from '../config/environment';

var ApplicationAdapter = DS.RESTAdapter.extend({
  namespace: `explore`
});

export default ApplicationAdapter;
