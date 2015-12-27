import DS from 'ember-data';
import Ember from 'ember';

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
  // Specify embedded attributes
  attrs: {
    // Bucket Type properties and Bucket properties
    props: {
      embedded: 'always'
    }
  },

  /**
   This indicates that the
   store should call `normalizeResponse` instead of `extract` and to expect
   a JSON-API Document back.
   @property isNewSerializerAPI
   */
  isNewSerializerAPI: true,

  /**
   `keyForAttribute` can be used to define rules for how to convert an
   attribute name in your model to a key in your JSON.

   @method keyForAttribute
   @param {String} key
   @param {String} method
   @return {String} normalized key
   */
  keyForAttribute: function(attr, method) {
    // Riak and Explorer json uses snake case, like 'development_mode'
    return Ember.String.underscore(attr);
  },

  normalizeResponse: function(store, primaryModelClass, payload, id, requestType) {
    let sortBy = Ember.Enumerable.sortBy;

    if (payload.clusters) {
      payload.clusters = payload.clusters.sortBy('id');
    }

    return this._super(store, primaryModelClass, payload, id, requestType);
  }
});
