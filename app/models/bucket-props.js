import DS from 'ember-data';
import Ember from 'ember';
import objectToArray from '../utils/riak-util';

/**
 * Represents a Bucket's or a Bucket Type's properties.
 * Since a Bucket inherits all of its parent Bucket Type's properties, both
 *    models use this object to store their properties.
 *
 * @see http://docs.basho.com/riak/latest/theory/concepts/Buckets/
 * @see http://docs.basho.com/riak/latest/dev/references/http/set-bucket-props/
 * @see http://docs.basho.com/riak/latest/dev/advanced/bucket-types/
 * @see http://docs.basho.com/riak/latest/dev/advanced/replication-properties/
 *
 * @class BucketProps
 * @extends DS.Model
 * @constructor
 */
var BucketProps = DS.Model.extend({
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
     * Returns a flat list of properties, used for display on a View Properties
     *     page.
     *
     * @method propsList
     * @return {Array<Hash>} List of key/value pairs
     */
    propsList: function() {
        if(!this.get('props')) {
            return [];
        }
        return objectToArray(this.get('props'));
    }.property('props'),

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
        var name;
        if(this.isCRDT()) {
            name = this.get('props').datatype;
        }
        if(name) {
            return name.capitalize();
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
    hasCommitHooks() {
        var hasPrecommit = !Ember.isEmpty(this.get('props').precommit);
        var hasPostcommit = !Ember.isEmpty(this.get('props').postcommit);
        if(hasPrecommit || hasPostcommit) {
            return true;
        }
        return false;
    },

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
    hasSiblings() {
        return this.get('props').allow_mult;
    },

    /**
     * Has this Bucket Type been activated via `riak-admin bucket-types activate`?
     * (Buckets inherit this setting from their parent bucket types.)
     *
     * @property isActive
     * @type Boolean
     */
    isActive: function() {
        return this.get('props').active;
    }.property('props'),

    /**
     * Does this bucket store Counter data type objects?
     *
     * @method isCounter
     * @return {Boolean}
     */
    isCounter() {
        return this.get('dataTypeName') === 'Counter';
    },

    /**
     * Does this bucket type store Riak Data Type objects?
     * @see http://docs.basho.com/riak/latest/dev/using/data-types/
     * @see http://docs.basho.com/riak/latest/theory/concepts/crdts/
     *
     * @method isCRDT
     * @return {Boolean}
     */
    isCRDT() {
        return this.get('props').datatype;
    },

    /**
     * Has the 'Last Write Wins' optimization been turned on for this bucket?
     * @see http://docs.basho.com/riak/latest/dev/using/conflict-resolution/#last-write-wins
     *
     * @method isLWW
     * @return {Boolean}
     */
    isLWW() {
        return this.get('props').last_write_wins;
    },

    /**
     * Does this bucket store Map data type objects?
     *
     * @method isMap
     * @return {Boolean}
     */
    isMap() {
        return this.get('dataTypeName') === 'Map';
    },

    /**
     * Has a Riak Search index been associated with this bucket type?
     *
     * @method isSearchIndexed
     * @return {Boolean} Technically it returns either a string index name or
     *     null, but it's being used for Boolean type semantics.
     */
    isSearchIndexed() {
        return this.get('searchIndexName');
    },

    /**
     * Does this bucket store Set data type objects?
     *
     * @method isSet
     * @return {Boolean}
     */
    isSet() {
        return this.get('dataTypeName') === 'Set';
    },

    /**
     * Has Strong Consistency been enabled for this bucket type?
     * @see http://docs.basho.com/riak/latest/dev/advanced/strong-consistency/
     *
     * @method isStronglyConsistent
     * @return {Boolean}
     */
    isStronglyConsistent() {
        return this.get('props').consistent;
    },

    /**
     * Has the 'Write Once' setting been enabled for this bucket type?
     * (This feature was introduced in Riak 2.1)
     * @see http://docs.basho.com/riak/latest/dev/advanced/write-once/
     *
     * @method isWriteOnce
     * @return {Boolean}
     */
    isWriteOnce() {
        return this.get('props').write_once;
    },

    /**
     * Returns the N value (number of object replicas) setting for this bucket type.
     * (Default is 3).
     * @see http://docs.basho.com/riak/latest/dev/advanced/replication-properties/
     *
     * @property nVal
     * @type Number
     */
    nVal: function() {
        return this.get('props').n_val;
    }.property('props'),

    /**
     * Returns a human-readable description of the conflict resolution strategy
     *   for this bucket type or bucket.
     *
     * @method resolutionStrategy
     * @return {String}
     */
    resolutionStrategy: function() {
        if(this.isStronglyConsistent()) {
            return 'Strongly Consistent';
        }
        if(this.isCounter()) {
            return 'Convergent, Pairwise Maximum Wins';
        }
        if(this.isMap()) {
            return 'Convergent, Add/Update Wins Over Remove';
        }
        if(this.isSet()) {
            return 'Convergent, Add Wins Over Remove';
        }
        if(this.hasSiblings()) {
            return 'Causal Context (Siblings Enabled)';
        }
        if(this.isWriteOnce()) {
            return 'n/a (Write-Once Optimized)';
        }
        // Last Write Wins optimization enabled
        if(this.isLWW()) {
            return 'Wall Clock (LastWriteWins enabled)';
        }

        // Default, regular riak object, allow_mult = false
        return 'Causal Context (Siblings Off, fallback to Wall Clock)';
    }.property('props'),

    /**
     * Returns a human-readable description of what type of objects are stored
     *    in this bucket type (default, search indexed, CRDTs, etc)
     *
     * @method objectType
     * @return {String}
     */
    objectType: function() {
        var type = [];
        if(this.isCRDT()) {
            type.push(this.get('dataTypeName'));
        } else {
            type.push('Default');
        }
        if(this.isSearchIndexed()) {
            type.push('Search Indexed');
        }
        return type.join(', ');
    }.property('props'),

    /**
     * Returns a hash containing quorum-related settings.
     * @see http://docs.basho.com/riak/latest/dev/advanced/replication-properties/
     *
     * @method quorum
     * @return {Hash}
     */
    quorum: function() {
        return {
            r: this.get('props').r,    // Read quorum
            w: this.get('props').r,    // Write Quorum
            pr: this.get('props').pr,  // Primary Read
            pw: this.get('props').pw,  // Primary Write
            dw: this.get('props').dw,  // Durable Write
            basic_quorum: this.get('props').basic_quorum,
            notfound_ok: this.get('props').notfound_ok
        };
    }.property('props'),

    /**
     * Returns true if this is an Eventually Consistent object type
     *    (versus Strongly Consistent type or a CRDT), and therefore the notion
     *    of 'Quorum' applies.
     *
     * @method quorumRelevant
     * @return {Boolean}
     */
    quorumRelevant() {
        return !this.isStronglyConsistent() && !this.isCRDT();
    },

    /**
     * Returns the name of the Search Index set on this bucket type or bucket
     * @see http://docs.basho.com/riak/latest/dev/using/search/
     *
     * @method searchIndexName
     * @return {String|Null}
     */
    searchIndexName: function() {
        return this.get('props').search_index;
    }.property('props'),

    /**
     * Returns human-readable warnings related to this bucket's settings.
     *
     * @method warnings
     * @return {Array<String>}
     */
    warnings: function() {
        var warnings = [];
        if(this.isStronglyConsistent()) {
            if(this.get('nVal') < 5) {
                warnings.push('Using Strong Consistency, but n_val < 5!');
            }
            if(this.isSearchIndexed()) {
                warnings.push('Combining Strong Consistency with Search. Use cation!');
            }
            if(this.hasCommitHooks()) {
                warnings.push('Using commit hooks, but those are ignored for Strongly Consistent data!');
            }
        }
        if(this.hasSiblings()) {  // Siblings enabled
            if(!this.get('props').dvv_enabled) {
                warnings.push('Dotted Version Vectors (dvv_enabled) should be enabled when Siblings are enabled.');
            }
        }
        return warnings;
    }.property('props')
});

export default BucketProps;
