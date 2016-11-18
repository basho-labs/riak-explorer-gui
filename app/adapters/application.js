import DS from 'ember-data';

/**
 * Provides common defaults for other adapters to extend: http://emberjs.com/api/data/classes/DS.Adapter.html
 * 
 * @class ApplicationAdapter
 * @namespace Adapters
 * @extends DS.RESTAdapter
 */
var ApplicationAdapter = DS.RESTAdapter.extend({
  namespace: `explore`
});

export default ApplicationAdapter;
