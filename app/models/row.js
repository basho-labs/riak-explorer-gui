import DS from 'ember-data';

export default DS.Model.extend({
  table: DS.belongsTo('table'),

  // The rows index in the cached list.
  // Don't like coupling it to the cached list, but it is easier to read this than to parse the string id
  index: DS.attr('string'),

  value: DS.attr('string')
});
