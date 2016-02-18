import Ember from 'ember';

export default Ember.Mixin.create({
  /**
   * Hash containing an object's metadata/headers.
   * Divided into three categories:
   *   1. 'custom' - user-defined custom headers
   *        (in the HTTP API, these start with `x-riak-meta-`).
   *        Stored as an array of headers (simple key/value hashes) for
   *        easy listing on the Edit Object screen.
   *   2. 'indexes' - Secondary Indexes
   *        Stored as an array of headers (simple key/value hashes) for
   *        easy listing on the Edit Object screen.
   *   3. 'other' - Standard object metadata (x-riak-vclock, etag, etc).
   *        Stored as a hash of keys/values (not a list, since these are fixed)
   *
   * @see http://docs.basho.com/riak/latest/dev/references/http/fetch-object/
   * @see http://docs.basho.com/riak/latest/dev/references/http/store-object/
   * @see http://docs.basho.com/riak/latest/dev/references/http/secondary-indexes/
   *
   * @property headers
   * @type Hash
   * @default { custom:[], indexes:[], other:{} }
   */
  headers: DS.attr(null, {
    defaultValue: {
      custom: [],     // x-riak-meta-*
      indexes: [],    // x-riak-index-*
      other: {}       // everything else
    }
  }),

  /**
   * Causal context header, used for server-side conflict resolution.
   * This is opaque to the client; the important thing is to load it
   * by reading first, before any sort of edit operation to an object.
   * @see http://docs.basho.com/riak/latest/dev/using/conflict-resolution/#Causal-Context
   *
   * @property causalContext
   * @readOnly
   * @type String
   */
  causalContext: function() {
    return this.get('headers').other['x-riak-vclock'];
  }.property('headers'),

  /**
   * HTTP Content-Type of the object (see section 14.17 of RFC 2616),
   * specified by the user when writing the object.
   * @property contentType
   * @type String
   */
  contentType: function() {
    return this.get('headers').other['content-type'];
  }.property('headers'),

  /**
   * Last-Modified timestamp.
   * Useful for conditional GET operations and caching.
   * @property contentType
   * @readOnly
   * @type String
   */
  dateLastModified: function() {
    return this.get('headers').other['last-modified'];
  }.property('headers'),

  /**
   * Date on which this object was loaded from Riak (via an HTTP request).
   * Used to give the user a sense of when the 'View Object' page was last
   * refreshed.
   * @property dateLoaded
   * @readOnly
   * @type String
   */
  dateLoaded: function() {
    return this.get('headers').other['date'];
  }.property('headers'),

  /**
   * HTTP Etag (entity tag). Unique identifier for this object and contents.
   * Useful for conditional GET operations and validation-based caching.
   * @property dateLoaded
   * @readOnly
   * @type String
   */
  etag: function() {
    return this.get('headers').other['etag'];
  }.property('headers'),

  /**
   * List of custom (user-specified) headers.
   * Mainly useful to "Tag" binary objects and enable Search to index them.
   * @property headersCustom
   * @type Array<Hash>
   * @example
   *     [ { "x-riak-meta-user_id": "user123" }]
   */
  headersCustom: function() {
    return this.get('headers').custom;
  }.property('headers'),

  /**
   * Re-assembles relevant object headers, such as the causal context and
   * any user-edited headers like secondary indexes or custom metadata.
   * Used when saving/updating an object.
   * @see http://docs.basho.com/riak/latest/dev/references/http/store-object/
   * @see http://docs.basho.com/riak/latest/dev/references/http/secondary-indexes/
   *
   * @method headersForUpdate
   * @return {Hash} Headers object suitable for a jQuery AJAX PUT request
   */
  headersForUpdate: function() {
    // Start with the causal context
    var headers = {
      'X-Riak-Vclock': this.get('causalContext')
    };
    var header;
    var i;
    // Add the 2i indexes, if applicable
    var indexes = this.get('headersIndexes');
    for (i = 0; i < indexes.length; i++) {
      header = indexes[i];
      headers[header.key] = header.value;
    }
    // Add the user-defined custom headers
    var customHeaders = this.get('headersCustom');
    for (i = 0; i < customHeaders.length; i++) {
      header = customHeaders[i];
      headers[header.key] = header.value;
    }
    return headers;
  }.property('headers'),

  /**
   * List of user-defined Secondary Indexes for this object.
   * @see http://docs.basho.com/riak/latest/dev/references/http/secondary-indexes/
   * @property headersIndexes
   * @type Array<Hash>
   */
  headersIndexes: function() {
    return this.get('headers').indexes;
  }.property('headers'),

  /**
   * Has this object been deleted, cluster-side?
   * Generally only encountered if `delete_mode` is set to 'keep',
   *   or if a tombstone is one of the object's siblings.
   * @see http://docs.basho.com/riak/latest/ops/advanced/deletion/
   * @see http://docs.basho.com/riak/latest/dev/references/http/delete-object/
   *
   * @property isDeleted
   * @type String
   * @readOnly
   */
  isDeleted: function() {
    return this.get('headers').other['x-riak-deleted'];
  }.property('headers')
});
