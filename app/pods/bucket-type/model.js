import DS from 'ember-data';

/**
 * Represents a Riak Bucket Type
 *
 * @class BucketType
 * @extends DS.Model
 * @constructor
 * @uses Cluster
 * @uses BucketProps
 * @uses BucketList
 */
var BucketType = DS.Model.extend({
  /**
   * Initializes a new BucketType instance by setting up an empty
   * BucketList.
   * @method init
   */
  init() {
    this._super();
    let emptyList = this.store.createRecord('bucket-list', {
      cluster: this.get('cluster'),
      buckets: []
    });
    this.set('bucketList', emptyList);
  },

  /**
   * Contains the results of cached bucket lists for this bucket type,
   * fetched from the API.
   * @property bucket-list
   * @type BucketList
   */
  bucketList: DS.belongsTo('bucket-list'),

  /**
   * Riak cluster in which this bucket type lives.
   * @property cluster
   * @type Cluster
   * @writeOnce
   */
  cluster: DS.belongsTo('cluster'),

  /**
   * Bucket Type Properties object.
   * Note: Bucket Types and Buckets share the same Properties format.
   * When not specified, buckets inherit their properties from the Bucket Type
   * @property props
   * @type BucketProps
   */
  props: DS.belongsTo('bucket-props'),

  /**
   * Has the bucketList been loaded from the server?
   * @property isBucketListLoaded
   * @type Boolean
   * @default false
   */
  isBucketListLoaded: DS.attr('boolean', {defaultValue: false}),

  /**
   * Bucket Type name (unique per cluster),
   *    as appears on `riak-admin bucket-type list`
   * @property originalId
   * @type String
   */
  originalId: DS.attr('string'),

  bucketTypeId: function() {
    return this.get('originalId');
  }.property('originalId'),

  /**
   * Returns the name of the cluster in which this bucket type resides.
   * (As specified in the `riak_explorer.conf` file)
   * @property clusterId
   * @type String
   */
  clusterId: function() {
    return this.get('cluster').get('clusterId');
  }.property('cluster'),

  /**
   * Returns the Search Index associated with this bucket type,
   *     if applicable.
   * @property index
   * @type String
   */
  index: function() {
    return this.get('cluster').get('searchIndexes')
      .findBy('name', this.get('props').get('searchIndexName'));
  }.property('cluster', 'props'),

  /**
   * Returns true if this Bucket Type has been activated.
   *
   * @property isActive
   * @type Boolean
   */
  isActive: function() {
    return this.get('props').get('isActive');
  }.property('props'),

  /**
   * Returns true if this Bucket Type has not yet been activated.
   *
   * @property isInactive
   * @type Boolean
   */
  isInactive: function() {
    return !this.get('isActive');
  }.property('props'),

  /**
   * Alias for the record's `id`, which is a composite ID in the form of
   *     `'<clusterId>/<bucketName>'`.
   * @see ExplorerResourceAdapter.normalizeId
   *
   * @method name
   * @type String
   * @example
   *    'dev-cluster/users'
   */
  name: function() {
    return this.get('id');
  }.property('id'),

  /**
   * TODO: This should be moved to the bucket props model, but big refactor needs to take place
   * Take bucket_props warnings and adds another check
   *
   * @method warnings
   * @returns array{String}
   */
  warnings: function() {
    let warnings = this.get('props').get('warnings');

    // Check for default schema inappropriate conditions. Ideally this would be happening on the bucket props model,
    //  but the proper relationships are not set up. This augments that method and does the
    //  appropriate check
    if (this.get('cluster').get('productionMode') &&
      this.get('props').get('isSearchIndexed')  &&
      this.get('index').get('schema').get('isDefaultSchema')) {
      warnings.push(
        'This bucket type is currently using a default schema on indexes in production. ' +
        'This can be very harmful, and it is recommended to instead use a custom schema on indexes.');
    }

    return warnings;
  }.property('cluster', 'props', 'index')
});

export default BucketType;
