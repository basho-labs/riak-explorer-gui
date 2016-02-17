import DS from 'ember-data';
import Ember from 'ember';

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
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
    // We are currently not using the "links" object in the payload. Until we do, remove from
    //  payload to keep deprecation warnings from showing up.
    delete payload.links;

    return this._super(store, primaryModelClass, payload, id, requestType);
  }
});
