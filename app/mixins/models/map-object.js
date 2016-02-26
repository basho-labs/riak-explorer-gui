import Ember from 'ember';

export default Ember.Mixin.create({
  sortBySubType: function(content) {
    let self = this;

    let sorted = {
      registers: {},
      flags: {},
      counters: {},
      sets: {},
      maps: {}
    };

    Ember.$.each(content, function( key, value ) {
      if (key.endsWith('_counter')) { sorted.counters[key] = value; }

      if (key.endsWith('_flag')) { sorted.flags[key] = value; }

      if (key.endsWith('_register')) { sorted.registers[key] = value; }

      if (key.endsWith('_set')) { sorted.sets[key] = value; }

      if (key.endsWith('_map')) { sorted.maps[key] = self.sortBySubType(value); }
    });

    return sorted;
  },

  contentsSortedBySubType: function() {
    if (this.get('bucket').get('isMap')) {
      return this.sortBySubType(this.get('contents'));
    }
  }.property('bucket', 'contents')
});
