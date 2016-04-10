import Ember from 'ember';

export default Ember.Mixin.create({
  scrollToTop: function() {
    return Ember.$('.view-body').scrollTop(0);
  }
});
