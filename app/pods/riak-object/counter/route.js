import RiakObjectRoute from '../route';

export default RiakObjectRoute.extend({
  actions: {
    increment: function(counter) {
      let currentValue = counter.get('contents');
      let newValue = currentValue + 1;

      counter.set('contents', newValue);
      this.explorer.updateObject(counter, { increment: 1 });
    },

    decrement: function(counter) {
      let currentValue = counter.get('contents');
      let newValue = currentValue - 1;

      counter.set('contents', newValue);
      this.explorer.updateObject(counter, { decrement: 1 });
    }
  }
});
