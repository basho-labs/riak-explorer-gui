import Ember from 'ember';
import DS from 'ember-data';
import _ from 'lodash/lodash';
import bucketPropsHelp from '../../utils/riak-help/bucket_props';

export default Ember.Mixin.create({
  /**
   * Hash of key/value pairs, obtained as a result of
   *    an HTTP GET Bucket Properties API call,
   *    or a GET Bucket Type Properties API call
   *
   * @property props
   * @type Hash
   * @example
   *     { "allow_mult":false, "basic_quorum":false, "write_once": false, ... }
   */
  props: DS.attr(),

  /**
   * Returns a capitalized name of the Riak Data Type stored in this bucket
   *    or bucket type (if this is a CRDT type bucket).
   * @see http://docs.basho.com/riak/latest/dev/using/data-types/
   * @see http://docs.basho.com/riak/latest/theory/concepts/crdts/
   *
   * @method dataTypeName
   * @return {String|Null} One of: [ 'Map', 'Set', 'Counter', null ]
   */
  dataTypeName: function() {
    if (this.get('props')) {
      let name = null;

      if (this.get('isCRDT')) {
        name = this.get('props').datatype;
      }

      if (name) {
        return name.capitalize();
      }
    }
  }.property('props'),

  /**
   * Does this bucket or bucket type have custom pre-commit or post-commit
   *     hooks enabled?
   * @see http://docs.basho.com/riak/latest/dev/using/commit-hooks/
   *
   * @method hasCommitHooks
   * @return {Boolean}
   */
  hasCommitHooks: function() {
    if (this.get('props')) {
      var hasPrecommit = !Ember.isEmpty(this.get('props').precommit);
      var hasPostcommit = !Ember.isEmpty(this.get('props').postcommit);

      return (hasPrecommit || hasPostcommit);
    }
  }.property('props'),

  /**
   * Have Siblings been enabled for this Bucket or Bucket Type?
   * Returns `false` by default if this is a bucket within the `default`
   * Bucket Type.
   * Otherwise (for any user-defined type) returns `true` by default.
   * @see http://docs.basho.com/riak/latest/dev/using/conflict-resolution/#Siblings
   *
   * @method hasSiblings
   * @return {Boolean}
   */
  hasSiblings: function() {
    if (this.get('props')) {
      return this.get('props').allow_mult;
    }
  }.property('props'),

  /**
   * Returns the name of the Search Index associated with this bucket/bucketType
   *
   * @property index
   * @type String
   */
  index: function() {
    return this.get('cluster').get('searchIndexes').findBy('name', this.get('searchIndexName'));
  }.property('cluster', 'searchIndexName'),

  /**
   * Has this Bucket Type been activated via `riak-admin bucket-types activate`?
   * (Buckets inherit this setting from their parent bucket types.)
   *
   * @property isActive
   * @type Boolean
   */
  isActive: function() {
    if (this.get('props')) {
      return this.get('props').active;
    }
  }.property('props'),

  /**
   * Does this bucket store Counter data type objects?
   *
   * @method isCounter
   * @return {Boolean}
   */
  isCounter: function() {
    return this.get('dataTypeName') === 'Counter';
  }.property('dataTypeName'),

  /**
   * Does this bucket type store Riak Data Type objects?
   * @see http://docs.basho.com/riak/latest/dev/using/data-types/
   * @see http://docs.basho.com/riak/latest/theory/concepts/crdts/
   *
   * @method isCRDT
   * @return {Boolean}
   */
  isCRDT: function() {
    if (this.get('props')) {
      return this.get('props').datatype;
    }
  }.property('props'),

  /**
   * Has this Bucket Type not been activated via `riak-admin bucket-types activate`?
   * (Buckets inherit this setting from their parent bucket types.)
   * Inverse of the isActive method
   *
   * @property isInactive
   * @type Boolean
   */
  isInactive: function() {
    if (this.get('props')) {
      return !this.get('props').active;
    }
  }.property('props'),

  /**
   * Has the 'Last Write Wins' optimization been turned on for this bucket?
   * @see http://docs.basho.com/riak/latest/dev/using/conflict-resolution/#last-write-wins
   *
   * @method isLWW
   * @return {Boolean}
   */
  isLWW: function() {
    if (this.get('props')) {
      return this.get('props').last_write_wins;
    }
  }.property('props'),

  /**
   * Does this bucket store Map data type objects?
   *
   * @method isMap
   * @return {Boolean}
   */
  isMap: function() {
    return this.get('dataTypeName') === 'Map';
  }.property('dataTypeName'),

  /**
   * Has a Riak Search index been associated with this bucket type?
   *
   * @method isSearchIndexed
   * @return {Boolean}
   */
  isSearchIndexed: function() {
    if (this.get('props')) {
      return !!this.get('props').search_index;
    }
  }.property('props'),

  /**
   * Does this bucket store Set data type objects?
   *
   * @method isSet
   * @return {Boolean}
   */
  isSet: function() {
    return this.get('dataTypeName') === 'Set';
  }.property('dataTypeName'),

  /**
   * Has Strong Consistency been enabled for this bucket type?
   * @see http://docs.basho.com/riak/latest/dev/advanced/strong-consistency/
   *
   * @method isStronglyConsistent
   * @return {Boolean}
   */
  isStronglyConsistent: function() {
    if (this.get('props')) {
      return this.get('props').consistent;
    }
  }.property('props'),

  /**
   * Has the 'Write Once' setting been enabled for this bucket type?
   * (This feature was introduced in Riak 2.1)
   * @see http://docs.basho.com/riak/latest/dev/advanced/write-once/
   *
   * @method isWriteOnce
   * @return {Boolean}
   */
  isWriteOnce: function() {
    if (this.get('props')) {
      return this.get('props').write_once;
    }
  }.property('props'),

  nonEditableProps: function() {
    let propsWithHelp = this.get('propsWithHelp');

    if (propsWithHelp) {
      let nonEditable = {};

      _.forOwn(propsWithHelp, function(value, key) {
        if (!value.editable) {
          nonEditable[key] = value;
        }
      });

      return nonEditable;
    }
  }.property('props'),

  /**
   * Returns the N value (number of object replicas) setting for this bucket type.
   * (Default is 3).
   * @see http://docs.basho.com/riak/latest/dev/advanced/replication-properties/
   *
   * @property nVal
   * @type Number
   */
  nVal: function() {
    if (this.get('props')) {
      return this.get('props').n_val;
    }
  }.property('props'),

  objectType: function() {
    if (this.get('props')) {
      let type = [];

      if (this.get('isCRDT')) {
        type.push(this.get('dataTypeName'));
      } else {
        type.push('Default');
      }

      if (this.get('isSearchIndexed')) {
        type.push('Search Indexed');
      }

      return type.join(', ');
    }
  }.property('props'),

  propsWithHelp: function() {
    let props = this.get('props');

    if (props) {
      let propsObj = {};

      // Prepare Objects for merge
      Object.keys(props).forEach(function(key) {
        propsObj[key] = {
          key: key,
          value: props[key]
        };
      });

      // Merges the propsObj and bucketPropsHelp Objects into a single object
      let merged = _.merge(propsObj, bucketPropsHelp);

      // Then mutates object to an array
      let toArray = _.values(merged);

      // Then filters out any props that don't have values
      let filtered = toArray.filter(function(prop) { return _.has(prop, 'value'); });

      // Then sort by name
      let sorted = _.sortBy(filtered, 'name');

      // Remove TS specific properties we do not want to display
      if (this.get('isTimeSeries')) {
        sorted = sorted.filter(function(prop) {
          return prop.key !== 'ddl';
        });
      }

      return sorted;
    }
  }.property('props'),

  /**
   * Returns a hash containing quorum-related settings.
   * @see http://docs.basho.com/riak/latest/dev/advanced/replication-properties/
   *
   * @method quorum
   * @return {Hash}
   */
  quorum: function() {
    if (this.get('props')) {
      return {
        r: this.get('props').r,    // Read quorum
        w: this.get('props').r,    // Write Quorum
        pr: this.get('props').pr,  // Primary Read
        pw: this.get('props').pw,  // Primary Write
        dw: this.get('props').dw,  // Durable Write
        basic_quorum: this.get('props').basic_quorum,
        notfound_ok: this.get('props').notfound_ok
      };
    }
  }.property('props'),

  /**
   * Returns true if this is an Eventually Consistent object type
   *    (versus Strongly Consistent type or a CRDT), and therefore the notion
   *    of 'Quorum' applies.
   *
   * @method quorumRelevant
   * @return {Boolean}
   */
  quorumRelevant: function() {
    if (this.get('props')) {
      return !this.get('isStronglyConsistent') && !this.get('isCRDT');
    }
  }.property('props'),

  /**
   * Returns a human-readable description of the conflict resolution strategy
   *   for this bucket type or bucket.
   *
   * @method resolutionStrategy
   * @return {String}
   */
  resolutionStrategy: function() {
    if (this.get('props')) {
      let strategy = null;

      switch (true) {
        case(this.get('isStronglyConsistent')):
          strategy = 'Strongly Consistent';
          break;
        case(this.get('isCounter')):
          strategy = 'Convergent, Pairwise Maximum Wins';
          break;
        case(this.get('isMap')):
          strategy = 'Convergent, Add/Update Wins Over Remove';
          break;
        case(this.get('isSet')):
          strategy = 'Convergent, Add Wins Over Remove';
          break;
        case(this.get('hasSiblings')):
          strategy = 'Causal Context (Siblings Enabled)';
          break;
        case(this.get('isWriteOnce')):
          strategy = 'n/a (Write-Once Optimized)';
          break;
        case(this.get('isLWW')):
          strategy = 'Wall Clock (LastWriteWins enabled)';
          break;
        default:
          strategy = 'Causal Context (Siblings Off, fallback to Wall Clock)';
      }

      return strategy;
    }
  }.property('props'),

  searchIndexHelp: function() {
    let searchIndexHelp = _.clone(bucketPropsHelp.search_index);

    searchIndexHelp.key = 'search_index';

    return searchIndexHelp;
  }.property('props'),

  /**
   * Returns the name of the Search Index set on this bucket type or bucket
   * @see http://docs.basho.com/riak/latest/dev/using/search/
   *
   * @method searchIndexName
   * @return {String|Null}
   */
  searchIndexName: function() {
    if (this.get('props')) {
      return this.get('props').search_index;
    }
  }.property('props'),

  /**
   * Returns human-readable warnings related to this bucket's settings.
   *
   * @method warnings
   * @return {Array<String>}
   */
  warnings: function() {
    if (this.get('props')) {
      var warnings = [];

      if (this.get('isStronglyConsistent')) {
        if (this.get('nVal') < 5) {
          warnings.push('Using Strong Consistency, but n_val < 5!');
        }
        if (this.get('isSearchIndexed')) {
          warnings.push('Combining Strong Consistency with Search. Use cation!');
        }
        if (this.get('hasCommitHooks')) {
          warnings.push('Using commit hooks, but those are ignored for Strongly Consistent data!');
        }
      }
      if (this.get('hasSiblings')) {  // Siblings enabled
        if (!this.get('props').dvv_enabled) {
          warnings.push('Dotted Version Vectors (dvv_enabled) should be enabled when Siblings are enabled.');
        }
      }
      // Check for default schema inappropriate conditions. Ideally this would be happening on the bucket props model,
      //  but the proper relationships are not set up. This augments that method and does the
      //  appropriate check
      if (this.get('cluster').get('productionMode') &&
        this.get('isSearchIndexed') &&
        this.get('index').get('schema').get('isDefaultSchema')) {
        warnings.push(
          'This bucket type is currently using a default schema on indexes in production. ' +
          'This can be very harmful, and it is recommended to instead use a custom schema on indexes.');
      }

      return warnings;
    }
  }.property('props', 'cluster', 'index')
});
