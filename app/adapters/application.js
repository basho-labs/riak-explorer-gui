import DS from 'ember-data';

/**
 * @class ApplicationAdapter
 * @namespace Adapters
 * @extends DS.RESTAdapter
 *
 * Provides common defaults for other adapters to extend: http://emberjs.com/api/data/classes/DS.Adapter.html
 */
var ApplicationAdapter = DS.RESTAdapter.extend({
  namespace: `explore`
});

export default ApplicationAdapter;
