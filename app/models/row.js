import DS from 'ember-data';

export default DS.Model.extend({
  table: DS.belongsTo('table'),

  // The rows index in the cached list.
  // Don't like coupling it to the cached list, but it is easier to read this than to parse the string id
  index: DS.attr('string'),

  // String representation of the row
  value: DS.attr('string'),

  // array representation of the row
  parsedValue: function() {
    if (this.get('value')) {
      return JSON.parse(this.get('value'));
    }
  }.property('value')
});
