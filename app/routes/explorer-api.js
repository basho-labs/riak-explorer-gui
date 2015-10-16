import Ember from 'ember';
import config from '../config/environment';

export default Ember.Route.extend({
    model: function() {
        var serviceName = 'Riak Explorer';
        var pingUrl = config.baseURL + 'explore/ping';
        var propsUrl = config.baseURL + 'explore/props';

        return new Ember.RSVP.hash({
            service: serviceName,
            pingResult: Ember.$.ajax({url: pingUrl, dataType: "json"}),
            propsResult: Ember.$.ajax({url: propsUrl, dataType: "json"}),
            routes: this.store.find('route')
        });
    }
});
