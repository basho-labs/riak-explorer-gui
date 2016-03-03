import Ember from 'ember';

export default Ember.Mixin.create({
  simulateLoad: function() {
    let  controller = this.controllerFor('application');

    controller.set('loading', true);

    setTimeout(function() {
      controller.set('loading', false);
    }, 200);
  },

  actions: {
    loading: function() {
      let  controller = this.controllerFor('application');

      controller.set('loading', true);

      if(this.router){
        this.router.one('didTransition', function() {
          controller.set('loading', false);
        });
      }
    },

    finished: function() {
      this.controllerFor('application').set('loading', false);
    }
  }
});
