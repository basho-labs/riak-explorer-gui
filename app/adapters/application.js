import DS from 'ember-data';

var ApplicationAdapter = DS.RESTAdapter.extend({
  namespace: `explore`
});

export default ApplicationAdapter;
