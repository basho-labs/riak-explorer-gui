import DS from 'ember-data';

/**
 * Represents Explorer API endpoints/routes.
 *
 * @class Route
 * @extends DS.Model
 * @constructor
 */
export default DS.Model.extend({
    links: DS.attr(),
    resources: DS.attr()
});
