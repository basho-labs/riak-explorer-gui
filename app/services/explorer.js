import Ember from 'ember';

export default Ember.Service.extend({
    name: 'explorer',
    availableIn: ['controllers', 'routes'],

    // Keep track of keys/buckets deleted through the Explorer UI
    deleted: {
        clusters: {}
    },

    bucketCacheRefresh(clusterId, bucketTypeId) {
        // For the moment, 'riak_kv' is the only implemented source of
        // cache refresh
        var url = '/explore/clusters/' + clusterId + '/bucket_types/' + bucketTypeId +
            '/refresh_buckets/source/riak_kv';
        return this.cacheRefresh(url);
    },

    /**
    * Refresh a key list cache or bucket list cache on the Explorer API side
    */
    cacheRefresh(url) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
            Ember.$.ajax({
                type: "POST",
                url: url
            }).then(
                function(data, textStatus, jqXHR) {
                    resolve(jqXHR.status);
                },
                function(jqXHR, textStatus) {
                    if(jqXHR.status === 202 && textStatus === 'parsererror') {
                        // Server responds with 202 Accepted, and empty body
                        resolve(jqXHR.status);
                    }
                    reject(textStatus);
                }
            );
        });
    },

    /**
     * @method collectMapFields
     * @param {Object} payload Value of the JSON payload of an HTTP GET
     *                   to the map object
     * @param {DS.Store} store
     * @return {Object} A hash of fields indexed by CRDT type and field name.
     */
    collectMapFields(payload, store) {
        var contents = {
            counters: {},
            flags: {},
            registers: {},
            sets: {},
            maps: {}
        };
        var field;

        for(var fieldName in payload) {
            if(fieldName.endsWith('_counter')) {
                contents.counters[fieldName] = payload[fieldName];
            }
            if(fieldName.endsWith('_flag')) {
                contents.flags[fieldName] = payload[fieldName];
            }
            if(fieldName.endsWith('_register')) {
                field = store.createRecord('riak-object.register', {
                    name: fieldName,
                    value: payload[fieldName]
                });
                contents.registers[fieldName] = field;
            }
            if(fieldName.endsWith('_set')) {
                contents.sets[fieldName] = payload[fieldName];
            }
            if(fieldName.endsWith('_map')) {
                contents.maps[fieldName] = this.collectMapFields(payload[fieldName]);
            }
        }
        return contents;
    },

    compositeId(clusterId, bucketTypeId) {
        return clusterId + '/' + bucketTypeId;
    },

    createBucketList(data, cluster, bucketType, store) {
        var bucketList = data.buckets.buckets.map(function(bucketName) {
            return store.createRecord('bucket', {
                name: bucketName,
                cluster: cluster,
                bucketType: bucketType
            });
        });
        return store.createRecord('bucket-list', {
            cluster: cluster,
            bucketType: bucketType,
            buckets: bucketList,
            total: data.buckets.total,
            count: data.buckets.count,
            created: data.buckets.created,
            isLoaded: true
        });
    },

    createKeyList(data, bucket, store) {
        var explorer = this;
        if(!data) {
            return store.createRecord('key-list', {
                bucket: bucket,
                cluster: bucket.get('cluster')
            });
        }
        var modelName = bucket.get('objectModelName');

        var keyList = data.keys.keys.map(function(key) {
            var obj = store.createRecord(modelName, {
                key: key,
                bucket: bucket,
                bucketType: bucket.get('bucketType'),
                cluster: bucket.get('cluster'),
                isLoaded: false
            });
            if(explorer.wasObjectDeleted(obj)) {
                obj.set('markedDeleted', true);
            }
            return obj;
        });
        return store.createRecord('key-list', {
            bucket: bucket,
            cluster: bucket.get('cluster'),
            created: data.keys.created,
            count: data.keys.count,
            keys: keyList,
            total: data.keys.total
        });
    },

    createObjectContents(bucket, payload, store) {
        var contents;
        if(bucket.get('props').get('isMap')) {
            contents = this.collectMapFields(payload.value, store);
        } else {
            contents = payload;
        }
        return contents;
    },

    createObjectFromAjax(key, bucket, rawHeader,
                payload, store, url) {
        var metadata = this.createObjectMetadata(rawHeader, store);
        var modelName = bucket.get('objectModelName');
        var contents = this.createObjectContents(bucket, payload, store);

        return store.createRecord(modelName, {
            key: key,
            bucket: bucket,
            bucketType: bucket.get('bucketType'),
            cluster: bucket.get('cluster'),
            metadata: metadata,
            isLoaded: true,
            contents: contents,
            rawUrl: url
        });
    },

    createObjectMetadata(rawHeader, store) {
        if (!rawHeader) {
            return store.createRecord('object-metadata');
        }
        return store.createRecord('object-metadata', {
            headers: this.parseHeaderString(rawHeader)
        });
    },

    /**
     * Composes the JSON action object for the specified operation type for use
     *    with the Riak Data Type HTTP API.
     *
     * @method dataTypeActionFor
     * @param {RiakObjectCounter|RiakObjectMap|RiakObjectSet} object
     * @param {String} operationType
     * @param {String|RiakObjectRegister|RiakObjectFlag} item
     */
    dataTypeActionFor(object, operationType, item) {
        var bucket = object.get('bucket');
        var operation;
        if(bucket.get('props').get('isCounter')) {
            if(operationType === 'increment') {
                operation = {increment: object.get('incrementBy')};
            } else {
                operation = {decrement: object.get('decrementBy')};
            }
        } else if(bucket.get('props').get('isSet')) {
            if(operationType === 'remove') {
                operation = { remove: item };
            } else if(operationType === 'addElement') {
                operation = { add: item };
            }
        } else if(bucket.get('props').get('isMap')) {
            if(operationType === 'removeRegister') {
                operation = { remove: item.get('name') };
            } else if(operationType === 'addRegister') {
                let update = {};
                update[item.get('name')] = item.get('value');
                operation = {
                    update: update
                };
            }
        }
        if(!operation) {
            console.log('Error: unsupported operationType %s', operationType);
        }

        return JSON.stringify(operation);
    },

    deleteBucket(bucket) {
        var url = '/explore/clusters/' + bucket.get('clusterId') +
            '/bucket_types/' + bucket.get('bucketTypeId') +
            '/buckets/' + bucket.get('bucketId');

        return new Ember.RSVP.Promise(function(resolve, reject) {
            Ember.$.ajax({
                type: "DELETE",
                url: url,
                success: function(data, textStatus, jqXHR) {
                    resolve(jqXHR.status);
                },
                error: function(jqXHR, textStatus) {
                    if(jqXHR.status === 202 && textStatus === 'parsererror') {
                        resolve(jqXHR.status);
                    } else {
                        reject(textStatus);
                    }
                }
            });
        });
    },

    // Fetch the cache of Deleted keys/buckets for a
    //  given cluster and bucket type. Initialize objects whenever missing.
    deletedCacheFor(clusterId, bucketTypeId) {
        if(!this.deleted.clusters[clusterId]) {
            this.deleted.clusters[clusterId] = { types: {} };
        }
        if(!this.deleted.clusters[clusterId].types[bucketTypeId]) {
            this.deleted.clusters[clusterId].types[bucketTypeId] = { buckets: {} };
        }
        return this.deleted.clusters[clusterId].types[bucketTypeId];
    },

    deleteObject(object) {
        var url = this.getClusterProxyUrl(object.get('clusterId')) + '/types/' +
                object.get('bucketTypeId') + '/buckets/' +
                object.get('bucketId') + '/keys/' + object.get('key');

        object.set('markedDeleted', true);

        var request = new Ember.RSVP.Promise(function(resolve, reject) {
            Ember.$.ajax({
                type: "DELETE",
                url: url,
                headers: { 'X-Riak-Vclock': object.get('metadata').get('causalContext') }
            }).then(
                function(data, textStatus, jqXHR) {
                    resolve(jqXHR.status);
                },
                function(jqXHR, textStatus) {
                    reject(textStatus);
                }
            );
        });

        return request.catch(function(error) {
            console.log('Error deleting riak object: %O', error);
        });
    },

    getBucket(clusterId, bucketTypeId, bucketId, store) {
        var self = this;
        return self.getBucketType(clusterId, bucketTypeId, store)
            .then(function(bucketType) {
                return self.getBucketProps(clusterId, bucketTypeId, bucketId, store)
                    .then(function(bucketProps) {
                        return store.createRecord('bucket', {
                            name: bucketId,
                            bucketType: bucketType,
                            cluster: bucketType.get('cluster'),
                            props: bucketProps
                        });
                    });
            });
    },

    getBucketList(cluster, bucketType, store) {
        console.log('Refreshing buckets for bucketType: %O', bucketType);
        var clusterId = cluster.get('clusterId');
        var bucketTypeId = bucketType.get('bucketTypeId');
        var url = '/explore/clusters/' + clusterId +
            '/bucket_types/' + bucketTypeId + '/buckets' ;
        var explorer = this;

        return new Ember.RSVP.Promise(function(resolve, reject) {
            var ajaxHash = {
                url: url,
                dataType: 'json',
                type: 'GET'
            };
            ajaxHash.success = function(data) { // Success, bucket list returned
                console.log("Found bucket list");
                bucketType.set('isBucketListLoaded', true);
                resolve(explorer.createBucketList(data, cluster, bucketType, store));
            };
            ajaxHash.error = function(jqXHR, textStatus) {
                // Fail (likely a 404, cache not yet created)
                if(jqXHR.status === 404) {
                    // Kick off a Cache Refresh, and repeat the getBucketList request
                    console.log("kicking off cache refresh...");
                    explorer.bucketCacheRefresh(clusterId, bucketTypeId);
                    // Return an empty (Loading..) list. Controller will poll to
                    // refresh it, later
                    var emptyList = store.createRecord('bucket-list', {
                        cluster: cluster,
                        bucketType: bucketType
                    });
                    Ember.run(null, resolve, emptyList);
                } else {
                    Ember.run(null, reject, textStatus);
                }
            };

            Ember.$.ajax(ajaxHash);
        });
    },

    getBucketProps(clusterId, bucketTypeId, bucketId, store) {
        var propsUrl = this.getClusterProxyUrl(clusterId) + '/types/' +
                bucketTypeId + '/buckets/' + bucketId + '/props';
        return new Ember.RSVP.Promise(function(resolve, reject) {
            var ajaxHash = {
                url: propsUrl,
                dataType: 'json',
                type: 'GET'
            };
            ajaxHash.success = function(data) {
                resolve(store.createRecord('bucket-props', data));
            };
            ajaxHash.error = function(jqXHR) {
                Ember.run(null, reject, jqXHR);
            };
            Ember.$.ajax(ajaxHash);
        });
    },

    getBucketType(clusterId, bucketTypeId, store) {
        var self = this;
        return self.getCluster(clusterId, store)
            .then(function(cluster) {
                return cluster.get('bucketTypes')
                    .findBy('originalId', bucketTypeId);
            });
    },

    getBucketTypeWithBucketList(bucketType, cluster, store) {
        return this.getBucketList(cluster, bucketType, store)
            .then(function(bucketList) {
                bucketType.set('bucketList', bucketList);
                return bucketType;
            });
    },

    getBucketTypesForCluster(cluster, store) {
        if(Ember.isEmpty(cluster.get('bucketTypes'))) {
            // If this page was accessed directly
            //  (via a bookmark and not from a link), bucket types are likely
            //  to be not loaded yet. Load them.
            return store.query('bucket-type',
                    {clusterId: cluster.get('clusterId')})
                .then(function(bucketTypes) {
                    cluster.set('bucketTypes', bucketTypes);
                    return bucketTypes;
                });
        } else {
            return cluster.get('bucketTypes');
        }
    },

    getBucketWithKeyList(bucket, store) {
        return this.getKeyList(bucket, store)
            .then(function(keyList) {
                bucket.set('keyList', keyList);
                return bucket;
            });
    },

    getCluster(clusterId, store) {
        var self = this;
        return store.findRecord('cluster', clusterId)
            .then(function(cluster) {
                // Ensure that bucket types are loaded
                self.getBucketTypesForCluster(cluster, store);
                return cluster;
            })
            .then(function(cluster) {
                return self.getIndexes(clusterId).then(function(indexes) {
                    cluster.set('indexes', indexes);
                    return cluster;
                });
            });
    },

    getClusterProxyUrl(clusterId) {
        return '/riak/clusters/'+clusterId;
    },

    getIndexes(clusterId) {
        var url = this.getClusterProxyUrl(clusterId) + '/search/index';

        var request = new Ember.RSVP.Promise(function(resolve, reject) {
            Ember.$.ajax({
                type: "GET",
                url: url
            }).then(
                // Success
                function(data) {
                    resolve(data);
                },
                // Error
                function(jqXHR, textStatus) {
                    if(jqXHR.status === 404) {
                        // No indexes found, simply return an empty list
                        resolve([]);
                    } else {
                        // Some other error
                        reject(textStatus);
                    }
                }
            );
        });
        return request;
    },

    getKeyList(bucket, store) {
        var clusterId = bucket.get('clusterId');
        var bucketTypeId = bucket.get('bucketTypeId');
        var bucketId = bucket.get('bucketId');
        var explorer = this;

        var url = '/explore/clusters/' + clusterId +
            '/bucket_types/' + bucketTypeId + '/buckets/' +
            bucketId + '/keys' ;
            // console.log('Retrieving key list, url: %s', url);

        return new Ember.RSVP.Promise(function(resolve, reject) {
            var ajaxHash = {
                url: url,
                dataType: 'json',
                type: 'GET'
            };
            ajaxHash.success = function(data) { // Success, key list returned
                bucket.set('isKeyListLoaded', true);
                resolve(explorer.createKeyList(data, bucket, store));
            };
            ajaxHash.error = function(jqXHR, textStatus) {
                if(jqXHR.status === 404) {
                    // Empty cache (need to kick off a refresh)
                    explorer.keyCacheRefresh(clusterId, bucketTypeId, bucketId);
                    // Results in returning an empty (Loading..) key list
                    Ember.run(null, resolve, null);
                } else {
                    // Some other error
                    Ember.run(null, reject, textStatus);
                }
            };
            Ember.$.ajax(ajaxHash);
        });
    },

    // Return all nodes for a particular cluster
    getNodes(clusterId) {
        var url = '/explore/clusters/'+ clusterId + '/nodes';

        var request = new Ember.RSVP.Promise(function(resolve, reject) {
            Ember.$.ajax({
                type: "GET",
                url: url
            }).then(
                // Success
                function(data) {
                    resolve(data.nodes);
                },
                // Error
                function(jqXHR, textStatus) {
                    if(jqXHR.status === 404) {
                        // No nodes found, simply return an empty list
                        resolve([]);
                    } else {
                        // Some other error
                        reject(textStatus);
                    }
                }
            );
        });
        return request;
    },

    getRiakObject(bucket, key, store) {
        var explorer = this;

        return new Ember.RSVP.Promise(function(resolve, reject) {
            var ajaxHash = {
                type: "GET",
                cache: false,
                headers: { 'Accept': '*/*, multipart/mixed' }
            };

            var processData;
            var headerString;
            var contents;
            var url = explorer.getClusterProxyUrl(bucket.get('clusterId')) + '/types/' +
                bucket.get('bucketTypeId') + '/buckets/' + bucket.get('bucketId');
            if(bucket.get('props').get('isCRDT')) {
                url = url + '/datatypes/' + key;
                processData = true;  // Parse the payload as JSON
                ajaxHash.dataType = 'json';
                ajaxHash.success = function(data, textStatus, jqXHR) {
                    headerString = jqXHR.getAllResponseHeaders();
                    contents = data;  // Parsed json
                    resolve(explorer.createObjectFromAjax(key, bucket, headerString,
                        contents, store, url));
                };
            } else {
                // Regular Riak object
                url = url + '/keys/' + key;
                processData = false;
                ajaxHash.success = function(data, textStatus, jqXHR) {
                    headerString = jqXHR.getAllResponseHeaders();
                    contents = jqXHR.responseText;  // Unparsed payload
                    resolve(explorer.createObjectFromAjax(key, bucket, headerString,
                        contents, store, url));
                };
            }
            ajaxHash.processData = processData;
            ajaxHash.url = url;

            ajaxHash.error = function(jqXHR, textStatus) {
                if(jqXHR.status === 200 && textStatus === 'parsererror') {
                    // jQuery tries to parse JSON objects, and throws
                    // parse errors when they're invalid. Suppress this.
                    headerString = jqXHR.getAllResponseHeaders();
                    resolve(explorer.createObjectFromAjax(key, bucket, headerString,
                        jqXHR.responseText, store, url));
                }
                if(jqXHR.status === 300) {
                    // Handle 300 Multiple Choices case for siblings
                    headerString = jqXHR.getAllResponseHeaders();
                    resolve(explorer.createObjectFromAjax(key, bucket, headerString,
                        jqXHR.responseText, store, url));
                } else {
                    reject(jqXHR);
                }
            };
            Ember.$.ajax(ajaxHash);
        });
    },

    keyCacheRefresh(clusterId, bucketTypeId, bucketId) {
        // For the moment, 'riak_kv' is the only implemented source of
        // cache refresh
        var url = '/explore/clusters/' + clusterId + '/bucket_types/' + bucketTypeId +
            '/buckets/' + bucketId + '/refresh_keys/source/riak_kv';
        return this.cacheRefresh(url);
    },

    markDeletedKey(object) {
        var clusterId = object.get('clusterId');
        var bucketTypeId = object.get('bucketTypeId');
        var bucketId = object.get('bucketId');
        var key = object.get('key');

        var bucketTypeDelCache = this.deletedCacheFor(clusterId, bucketTypeId);

        if(!bucketTypeDelCache.buckets[bucketId]) {
            bucketTypeDelCache.buckets[bucketId] = {
                keysDeleted: {},
                bucketDeleted: false
            };
        }

        bucketTypeDelCache.buckets[bucketId].keysDeleted[key] = true;
    },

    /**
    * XmlHttpRequest's getAllResponseHeaders() method returns a string of response
    * headers according to the format described here:
    * http://www.w3.org/TR/XMLHttpRequest/#the-getallresponseheaders-method
    *
    * Which we then have to parse. Like savages.
    */
    parseHeaderString(headerString) {
        var other_headers = {};
        var indexes = [];
        var custom = [];

        var headerLines = headerString.split("\r\n");

        for (var i = 0; i < headerLines.length; i++) {
            var headerLine = headerLines[i];

            // Can't use split() here because it does the wrong thing
            // if the header value has the string ": " in it.
            var index = headerLine.indexOf(': ');
            if (index > 0) {
              var key = headerLine.substring(0, index).toLowerCase();
              var val = headerLine.substring(index + 2);
              var header = {
                  key: key,
                  value: val
              };

              if(key.startsWith('x-riak-meta')) {
                  custom.push(header);
              } else if(key.startsWith('x-riak-index')) {
                  indexes.push(header);
              } else {
                  other_headers[key] = val;
              }
            }
        }
        return {
            other: other_headers,
            indexes: indexes,
            custom: custom
        };
    },

    saveObject(object) {
        var url = this.getClusterProxyUrl(object.get('clusterId')) + '/types/' +
                object.get('bucketTypeId') + '/buckets/' +
                object.get('bucketId') + '/keys/' + object.get('key');

        var request = new Ember.RSVP.Promise(function(resolve, reject) {
            Ember.$.ajax({
                type: "PUT",
                processData: false,
                contentType: object.get('metadata').get('contentType'),
                url: url,
                headers: object.get('metadata').get('headersForUpdate'),
                data: object.get('contents')
            }).then(
                function(data, textStatus, jqXHR) {
                    resolve(jqXHR.status);
                },
                function(jqXHR, textStatus) {
                    reject(textStatus);
                }
            );
        });

        return request.catch(function(error) {
            console.log('Error saving riak object: %O', error);
        });
    },

    /**
     * Performs an update AJAX operation to the Riak Data Type HTTP API endpoint
     *
     * @method updateDataType
     * @param {RiakObjectCounter|RiakObjectMap|RiakObjectSet} object
     * @param {String} operationType
     * @param {String|RiakObjectRegister|RiakObjectFlag} item
     */
    updateDataType(object, operationType, item) {
        var bucket = object.get('bucket');
        var url = this.getClusterProxyUrl(bucket.get('clusterId')) + '/types/' +
            bucket.get('bucketTypeId') + '/buckets/' + bucket.get('bucketId') +
            '/datatypes/' + object.get('key');
        var self = this;

        return new Ember.RSVP.Promise(function(resolve, reject) {
            var ajaxHash = {
                contentType: 'application/json',
                type: 'POST',
                dataType: 'json',
                url: url,
                data: self.dataTypeActionFor(object, operationType, item),
                success: function(data) {
                    resolve(data);
                },
                error: function(jqXHR) {
                    if(jqXHR.status === 204) {
                        resolve(jqXHR.status);
                    } else {
                        reject(jqXHR);
                    }
                }
            };
            Ember.$.ajax(ajaxHash);
        });
    },

    wasObjectDeleted(object) {
        var clusterId = object.get('clusterId');
        var bucketTypeId = object.get('bucketTypeId');
        var bucketId = object.get('bucketId');
        var key = object.get('key');
        var bucketTypeDelCache = this.deletedCacheFor(clusterId, bucketTypeId);
        if(!bucketTypeDelCache.buckets[bucketId]) {
            return false;
        }
        return bucketTypeDelCache.buckets[bucketId].keysDeleted[key];
    }
});
