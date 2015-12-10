import ApplicationAdapter from './application';
import Ember from 'ember';

// Models fetching Riak resources from Explorer's own API

var ExplorerResourceAdapter = ApplicationAdapter.extend({
    /**
      Builds a URL for a given type and optional ID.

      By default, it pluralizes the type's name (for example, 'post'
      becomes 'posts' and 'person' becomes 'people'). To override the
      pluralization see [pathForType](#method_pathForType).

      If an ID is specified, it adds the ID to the path generated
      for the type, separated by a `/`.

      When called by RESTAdapter.findMany() the `id` and `snapshot` parameters
      will be arrays of ids and snapshots.

      @method buildURL
      @param {String} modelName
      @param {(String|Array|Object)} id single id or array of ids or query
      @param {(DS.Snapshot|Array)} snapshot single snapshot or array of snapshots
      @param {String} requestType
      @param {Object} query object of query parameters to send for query requests.
      @return {String} url
    */
    buildURL: function(modelName, id, snapshot, requestType, query) {
        switch (requestType) {
            case 'findRecord':
                return this.urlForFindRecord(id, modelName, snapshot);
            case 'findAll':
                return this.urlForFindAll(modelName);
            case 'query':
                return this.urlForQuery(query, modelName);
            default:
                return this._buildURL(modelName, id);
        }
    },

    /**
    The `findRecord()` method is invoked when the store is asked for a record that
    has not previously been loaded. In response to `findRecord()` being called, you
    should query your persistence layer for a record with the given ID. Once
    found, you can asynchronously call the store's `push()` method to push
    the record into the store.
    @method findRecord
    @param {DS.Store} store
    @param {DS.Model} type
    @param {String} id
    @param {DS.Snapshot} snapshot of the model instance (immutable)
    @return {Promise} promise
    */
    findRecord: function(store, type, id, snapshot) {
        let url = this.buildURL(type.modelName, id, snapshot, 'findRecord');
        //   if (this.sortQueryParams) {
        //     query = this.sortQueryParams(query);
        //   }

        return this.ajax(url, 'GET');
    },

    injectParentIds: function(payload, query) {
        if(query.clusterId) { payload.cluster_id = query.clusterId; }
        if(query.bucketTypeId) { payload.bucket_type_id = query.bucketTypeId; }
    },

    /**
    Normalize the ID in a given resource into globally unique
    version required by Ember Data.
    (Most Riak cluster resources do not have globally unique IDs.
    For example, bucket types are only unique within a cluster.)
    */
    normalizeId: function(record, type, query, idKey='id') {
        let fragments   = [];
        let compositeId = null;

        if(query.clusterId) { fragments.push(query.clusterId); }
        if(query.bucketTypeId && type.modelName !== 'bucket-type') { fragments.push(query.bucketTypeId); }

        fragments.push(record[idKey]);
        record.original_id = record[idKey];
        compositeId = fragments.join('/');
        record.id = compositeId;

        if(record.props) { record.props.id = record.id; }
    },

    /**
    Relevant for Bucket Type Properties and Bucket Properties
    */
    normalizeProps: function(record, modelName) {
        if(modelName === 'bucket-type' || modelName === 'bucket') {
            record.props = {
                id: record.props.id,
                props: record.props
            };

            delete record.props.props.id;
        }
    },

    pathForType: function(type) {
        return Ember.String.underscore(Ember.String.pluralize(type));
    },

    /**
    Called by the store in order to fetch a JSON array for
    the records that match a particular query.
    @private
    @method query
    @param {DS.Store} store
    @param {DS.Model} type
    @param {Object} query (POJO, contains query parameters)
    @return {Promise} promise
    */
    query: function(store, type, query) {
        let adapter = this;
        let url = this.buildURL(type.modelName, null, null, 'query', query);

        let promise = this.ajax(url, 'GET').then(function(payload) {
            let root = adapter.pathForType(type.modelName);

            payload[root].forEach(function(record) {
                adapter.normalizeId(record, type, query);
                adapter.injectParentIds(record, query);
                adapter.normalizeProps(record, type.modelName);
            });

            return payload;
        });

        return promise;
    },

    /**
    Invoked when the store is asked for a single
    record through a query object.
    @private
    @method query
    @param {DS.Store} store
    @param {DS.Model} type
    @param {Object} query (POJO, contains query parameters)
    @return {Promise} promise
    */
    queryRecord: function(store, type, query) {
        let adapter = this;
        let url = this.buildURL(type.modelName, null, null, 'query', query);
        let root = Ember.String.underscore(type.modelName);

        let promise = this.ajax(url, 'GET').then(function(payload) {
            adapter.normalizeId(payload[root], type, query);
            adapter.injectParentIds(payload[root], query);
            adapter.normalizeProps(payload[root], type.modelName);

            return payload;
        });

        return promise;
    },


    urlForQuery: function(query, modelName) {
        let urlFragments = [];

        if(modelName.indexOf('.') > -1) {
            // Deal with nested model names, like 'cluster.bucket_types'
            modelName = modelName.split('.').pop();
        }

        // For the moment, assume we're only dealing with cluster-based resources
        urlFragments.push(this._buildURL('cluster', query.clusterId));
        urlFragments.push(this.pathForType('bucket-type'));

        if(query.bucketTypeId) { urlFragments.push(query.bucketTypeId); }

        return urlFragments.join('/');
    }
});

export default ExplorerResourceAdapter;
