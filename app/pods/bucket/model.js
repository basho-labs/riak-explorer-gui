import DS from 'ember-data';

/**
 * Represents a Riak Bucket
 *
 * @class Bucket
 * @extends DS.Model
 * @constructor
 * @uses BucketType
 * @uses Cluster
 * @uses BucketProps
 * @uses KeyList
 */
var Bucket = DS.Model.extend({
  /**
   * Initializes a new Bucket instance by setting up an empty
   * KeyList.
   * @method init
   */
  //init() {
  //  this._super();
  //  let emptyList = this.store.createRecord('key-list', {
  //    cluster: this.get('cluster'),
  //    keys: []
  //  });
  //  this.set('keyList', emptyList);
  //},

  /**
   * Riak Bucket Type in which this bucket lives.
   *
   * @property bucketType
   * @type BucketType
   * @writeOnce
   */
  bucketType: DS.belongsTo('bucket-type'),

  /**
   * Riak cluster in which this bucket lives.
   *
   * @property cluster
   * @type Cluster
   * @writeOnce
   */
  //cluster: DS.belongsTo('cluster'),

  /**
   * Contains the results of cached key lists for this bucket,
   * fetched from the API.
   *
   * @property key-list
   * @type KeyList
   */
  //keyList: DS.belongsTo('key-list'),

  /**
   * Bucket Properties object. Note: Bucket Types and Buckets share the
   *    same Properties format.
   * When not specified, buckets inherit their properties from the Bucket Type
   *
   * @property props
   * @type BucketProps
   */
  //props: DS.belongsTo('bucket-props'),

  /**
   * Has the keyList been loaded from the server?
   *
   * @property isKeyListLoaded
   * @type Boolean
   * @default false
   */
  //isKeyListLoaded: DS.attr('boolean', {defaultValue: false}),

  /**
   * Bucket name (unique within a cluster and bucket type)
   *
   * @property name
   * @type String
   */
  name: DS.attr('string')
  //,

  /**
   * Returns the bucket name (this is an alias/helper function)
   *
   * @property bucketId
   * @type String
   */
  //bucketId: function() {
  //  return this.get('name');
  //}.property('name'),

  /**
   * Returns the bucket type's name
   *
   * @property bucketTypeId
   * @type String
   */
  //bucketTypeId: function() {
  //  return this.get('bucketType').get('bucketTypeId');
  //}.property('cluster'),

  /**
   * Returns the name of the cluster in which this bucket resides.
   * (As specified in the `riak_explorer.conf` file)
   *
   * @property clusterId
   * @type String
   */
  //clusterId: function() {
  //  return this.get('cluster').get('clusterId');
  //}.property('cluster'),

  /**
   * Returns the name of the Search Index associated with this bucket
   * (or its parent bucket type), if applicable.
   *
   * @property index
   * @type String
   */
  //index: function() {
  //  return this.get('cluster').get('searchIndexes')
  //    .findBy('name', this.get('props').get('searchIndexName'));
  //}.property('cluster'),

  /**
   * Has this bucket type been activated?
   *
   * @property isActive
   * @type Boolean
   */
  //isActive: function() {
  //  if (this.get('bucketTypeId') === 'default') {
  //    // Buckets in the Default type don't have the 'active' attribute
  //    // in the props, but are actually active.
  //    return true;
  //  }
  //  return this.get('props').get('isActive');
  //}.property('props'),

  /**
   * Returns the Ember.js/Ember Data model name of the objects stored within
   *     this bucket.
   *
   * @property objectModelName
   * @type String
   * @readOnly
   * @default 'riak-object'
   */
  //objectModelName: function() {
  //  let modelType = null;
  //
  //  switch (true) {
  //    case this.get('props').get('isCounter'):
  //      modelType = 'riak-object.counter';
  //      break;
  //    case this.get('props').get('isSet'):
  //      modelType = 'riak-object.set';
  //      break;
  //    case this.get('props').get('isMap'):
  //      modelType = 'riak-object.map';
  //      break;
  //    default:
  //      modelType = 'riak-object';
  //      break;
  //  }
  //
  //  return modelType;
  //}.property('props'),

  /**
   * Returns this bucket's properties as an array of key/value tuples.
   * Used for displaying and editing the properties.
   *
   * @method propsList
   * @return {Array<Hash>}
   */
  //propsList: function() {
  //  if (!this.get('props')) {
  //    return [];
  //  }
  //  return this.get('props').get('propsList');
  //}.property('props'),

  /**
   * TODO: This should be moved to the bucket props model, but big refactor needs to take place
   * Take bucket_props warnings and adds another check
   *
   * @method warnings
   * @returns array{String}
   */
  //warnings: function() {
  //  if (this.get('props')) {
  //    let warnings = this.get('props').get('warnings');
  //
  //    // Check for default schema inappropriate conditions. Ideally this would be happening on the bucket props model,
  //    //  but the proper relationships are not set up. This augments that method and does the
  //    //  appropriate check
  //    if (this.get('cluster').get('productionMode') &&
  //      this.get('props').get('isSearchIndexed')  &&
  //      this.get('index').get('schema').get('isDefaultSchema')) {
  //      warnings.push(
  //        'This bucket is currently using a default schema on indexes in production. ' +
  //        'This can be very harmful, and it is recommended to instead use a custom schema on indexes.');
  //    }
  //
  //    return warnings;
  //  }
  //}.property('cluster', 'props', 'index')
});

export default Bucket;
