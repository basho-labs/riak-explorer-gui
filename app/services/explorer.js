import Ember from 'ember';
import config from '../config/environment';
import objectToArray from '../utils/riak-util';
import parseHeader from '../utils/parse-header';

/**
 * An Ember service responsible for AJAX communication with the Explorer API.
 *
 * @class ExplorerService
 * @extends Ember.Service
 * @constructor
 * @uses Bucket
 * @uses BucketType
 * @uses BucketProps
 * @uses Cluster
 * @uses RiakObject
 * @uses ObjectMetadata
 */
export default Ember.Service.extend({
  /**
   * User-configurable URL prefix for the Explorer GUI.
   * (Also the URL prefix for the Explorer API).
   * Currently, the options are: '/' or '/admin/'.
   *
   * @property apiURL
   * @type String
   * @default '/'
   */
  apiURL: config.baseURL,

  name: 'explorer',

  availableIn: ['controllers', 'routes'],

  /**
   * Default chunk size for requests that can potentially have large amounts of records
   * i.e. buckets and keys
   *
   * @property pageSize
   * @type Integer
   * @default 500
   */
  pageSize: config.pageSize,

  /**
   *
   * @method associateSchemasWithIndexes
   * @param {DS.Model} cluster
   */
  associateSchemasWithIndexes(cluster) {
    let self = this;

    cluster.get('searchIndexes').forEach(function(index) {
      let schemaName = index.get('schemaRef');
      let schema = cluster.get('searchSchemas').findBy('name', schemaName);

      if (!schema) {
        schema = self.store.createRecord('search-schema', {
          id: `${cluster.get('name')}/${schemaName}`,
          cluster: cluster,
          name: schemaName
        });
      }

      index.set('schema', schema);
    });
  },

  /**
   * Checks availability and validity of nodes in a given cluster.
   *
   * @method checkNodes
   * @param {DS.Model} cluster
   */
  checkNodes(cluster) {
    // Ping each node in cluster
    this.pingNodes(cluster);
    // Get status of each node in cluster
    this.getNodesStatus(cluster);
  },

  /**
   * Creates a Schema instance
   *
   * @method createSchema
   * @param {String} clusterName
   * @param {String} schemaName
   * @param {XML.String} data
   */
  createSchema(clusterName, schemaName, data) {
    let url = `/riak/clusters/${clusterName}/search/schema/${schemaName}`;

    return Ember.$.ajax({
      type: 'PUT',
      url: url,
      contentType: 'application/xml',
      processData: false,
      data: data
    });
  },

  /**
   *
   * @method getBucket
   * @param {String} clusterName
   * @param {String} bucketTypeName
   * @param {String} bucketName
   * @return {DS.Model} Bucket
   */
  getBucket(clusterName, bucketTypeName, bucketName) {
    let self = this;

    return this.getBucketType(clusterName, bucketTypeName)
      .then(function(bucketType) {
        return bucketType.get('buckets').findBy('name', bucketName);
      })
      .then(function(bucket) {
        return Ember.RSVP.allSettled([
          bucket,
          self.getBucketProps(bucket)
        ]);
      })
      .then(function(PromiseArray) {
        let bucket = PromiseArray[0].value;

        return Ember.RSVP.allSettled([
          bucket,
          self.getObjectList(bucket),
          self.getObjects(bucket)
        ]);
      })
      .then(function(PromiseArray) {
        let bucket = PromiseArray[0].value;

        return bucket;
      });
  },

  /**
   *
   * @method getBucketList
   * @param {DS.Model} bucketType
   * @return {DS.Model} BucketList
   */
  getBucketList(bucketType) {
    let clusterName = bucketType.get('cluster').get('name');
    let bucketTypeName = bucketType.get('name');
    let queryTries = 0;
    let self = this;

    return this.store.queryRecord('bucket-list', { clusterName: clusterName, bucketTypeName: bucketTypeName })
      .then(
        function onSuccess(bucketList) {
          bucketType.set('bucketList', bucketList);
          bucketType.set('isListLoaded', true);

          return bucketType.get('bucketList');
        },
        function onFail() {
          if (bucketType.get('cluster').get('developmentMode') && queryTries < 3) {
            // kick off a cache refresh if in development mode and retry
            queryTries++;
            bucketType.set('statusMessage', 'Cache not found. Refreshing from a streaming list buckets call...');
            self.refreshBucketList(bucketType);
          } else {
            // Let the UI know that the response has been completed
            bucketType.set('isListLoaded', true);
          }
        }
      );
  },

  /**
   *
   * @method getBucketProps
   * @param {DS.Model} bucket
   * @return {Object} Bucket.props
   */
  getBucketProps(bucket) {
    let clusterUrl = bucket.get('bucketType').get('cluster').get('proxyUrl');
    let bucketTypeName = bucket.get('bucketType').get('name');
    let bucketName = bucket.get('name');
    let url = `${clusterUrl}/types/${bucketTypeName}/buckets/${bucketName}/props`;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      let request = Ember.$.ajax({
        url: url,
        type: 'GET'
      });

      request.done(function(data) {
        bucket.set('props', data.props);

        resolve(data);
      });

      request.fail(function(data) {
        reject(data);
      });
    });
  },

  /**
   *
   * @method getBuckets
   * @param {DS.Model} bucketType
   * @return {DS.Array} Bucket
   */
  getBuckets(bucketType) {
    if (Ember.isEmpty(bucketType.get('buckets'))) {
      let clusterName = bucketType.get('cluster').get('name');
      let bucketTypeName = bucketType.get('name');

      return this.store.query('bucket', { clusterName: clusterName, bucketTypeName: bucketTypeName })
        .then(function(buckets) {
          bucketType.set('buckets', buckets);

          return bucketType.get('buckets');
        });
    } else {
      return bucketType.get('buckets');
    }

    //return new Ember.RSVP.Promise(function(resolve, reject) {
    //  var xhrConfig = {
    //    url: url,
    //    dataType: 'json',
    //    type: 'GET',
    //    success: function(data) {
    //      bucketType.set('isBucketListLoaded', true);
    //      resolve(explorer.createBucketList(data, cluster, bucketType, start));
    //    },
    //    error: function(jqXHR, textStatus) {
    //      // Fail (likely a 404, cache not yet created)
    //      if (jqXHR.status === 404) {
    //        // Return an empty (Loading..) list. Controller will poll to
    //        // refresh it, later
    //        let data = null;
    //        let emptyList = explorer.createBucketList(data, cluster, bucketType);
    //        if (cluster.get('developmentMode')) {
    //          bucketType.set('isBucketListLoaded', false);
    //          emptyList.set('statusMessage', 'Cache not found. Refreshing from a streaming list buckets call...');
    //          // Kick off a Cache Refresh
    //          explorer.bucketCacheRefresh(clusterId, bucketTypeId);
    //        } else {
    //          bucketType.set('isBucketListLoaded', true);
    //          // In Production mode, no cache refresh will happen
    //          emptyList.set('cachePresent', false);
    //        }
    //        Ember.run(null, resolve, emptyList);
    //      } else {
    //        Ember.run(null, reject, textStatus);
    //      }
    //    }
    //  };
    //
    //  Ember.$.ajax(xhrConfig);
    //});
  },

  /**
   *
   * @method getBucketType
   * @param {String} clusterName
   * @param {String} bucketTypeName
   * @return {DS.Model} BucketType
   */
  getBucketType(clusterName, bucketTypeName) {
    let self = this;

    return this.getCluster(clusterName)
      .then(function(cluster) {
        return cluster.get('bucketTypes').findBy('name', bucketTypeName);
      })
      .then(function(bucketType) {
        return Ember.RSVP.allSettled([
          bucketType,
          self.getBucketList(bucketType),
          self.getBuckets(bucketType)
        ]);
      })
      .then(function(PromiseArray) {
        let bucketType = PromiseArray[0].value;

        return bucketType;
      });
  },

  /**
   * Returns all the Bucket Types that belong to the specified cluster.
   *
   * @method getBucketTypes
   * @param {DS.Model} cluster
   * @return {DS.Array} BucketType
   */
  getBucketTypes(cluster) {
    if (Ember.isEmpty(cluster.get('bucketTypes'))) {
      return this.store.query('bucket-type', { clusterName: cluster.get('name') })
        .then(function(bucketTypes) {
          cluster.set('bucketTypes', bucketTypes);

          return cluster.get('bucketTypes');
        });
    } else {
      return cluster.get('bucketTypes');
    }
  },

  /**
   * Fetches a given config file and its dependencies
   *
   * @method getConfigFile
   * @param {String} clusterName
   * @param {String} nodeName
   * @param {String} configName
   * @return {DS.Model} ConfigFile
   */
  getConfigFile(clusterName, nodeName, configName) {
    let self = this;

    return this.getNode(clusterName, nodeName)
      .then(function(node) {
        return node.get('configFiles').findBy('name', configName);
      })
      .then(function(configFile) {
        return Ember.RSVP.allSettled([
          configFile,
          self.getConfigFileContents(configFile)
        ]);
      })
      .then(function(PromiseArray) {
        let configFile = PromiseArray[0].value;

        return configFile;
      });
  },

  /**
   * Fetches and creates a set of config file for a given node.
   *
   * @method getConfigFiles
   * @param {DS.Model} node
   * @return {DS.Array} ConfigFile
   */
  getConfigFiles(node) {
    if (Ember.isEmpty(node.get('configFiles'))) {
      return this.store.query('config-file', {clusterName: node.get('cluster').get('name'), nodeName: node.get('name')})
        .then(function(configFiles) {
          node.set('configFiles', configFiles);

          return node.get('configFiles');
        });
    } else {
      return node.get('configFiles');
    }
  },

  /**
   * Fetches and sets a  given config files contents
   *
   * @method getConfigFileContents
   * @param {DS.Model} config
   * @return {DS.Model} ConfigFile
   */
  getConfigFileContents(config) {
    let clusterName = config.get('node').get('cluster').get('name');
    let nodeName    = config.get('node').get('name');
    let configName  = config.get('name');
    let url  = `${this.apiURL}explore/clusters/${clusterName}/nodes/${nodeName}/config/files/${configName}`;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      let request = Ember.$.ajax({
        url: url,
        type: 'GET',
        headers: {
          Accept : "plain/text;"
        }
      });

      request.done(function(data) {
        config.set('content', data);

        resolve(config);
      });

      request.fail(function(data) {
        reject(data);
      });
    });
  },

  /**
   * Creates and returns a Cluster object and initializes it with dependent
   * data (including all its Bucket Types and Search Indexes).
   *
   * @method getCluster
   * @param {String} clusterName
   * @return {DS.Model} Cluster
   */
  getCluster(clusterName) {
    var self = this;

    return this.getClusters()
      .then(function(clusters) {
        return clusters.findBy('name', clusterName);
      })
      .then(function(cluster) {
        return Ember.RSVP.allSettled([
          cluster,
          self.getBucketTypes(cluster),
          self.getIndexes(cluster),
          self.getNodes(cluster)
        ]);
      })
      .then(function(PromiseArray) {
        let cluster = PromiseArray[0].value;

        // Create search-schemas from index references
        self.associateSchemasWithIndexes(cluster);

        // Check on node health of the cluster
        self.checkNodes(cluster);

        // Continue to check on node health
        //self.pollNodes(cluster);

        return cluster;
      });
  },

  /**
   * Fetches all clusters defined in the riak_explorer.conf file
   *
   * @method getClusters
   * @return {DS.Array} Cluster
   */
  getClusters() {
    return this.store.findAll('cluster');
  },

  /**
   *
   * @method getIndex
   * @param {String} clusterName
   * @param {String} indexName
   * @param {DS.Model} SearchIndex
   */
  getIndex(clusterName, indexName) {
    let self = this;

    return this.getCluster(clusterName)
      .then(function(cluster) {
        return cluster.get('searchIndexes').findBy('name', indexName);
      })
  },

  /**
   * Returns a list of Search Indexes that have been created on this cluster.
   * @see http://docs.basho.com/riak/latest/dev/references/http/search-index-info/
   *
   * @method getIndexes
   * @param {DS.Model} cluster
   * @return {DS.Array} SearchIndex
   */
  getIndexes(cluster) {
    if (Ember.isEmpty(cluster.get('searchIndexes'))) {
      // If this page was accessed directly
      //  (via a bookmark and not from a link), bucket types are likely
      //  to be not loaded yet. Load them.
      return this.store.query('search-index', {clusterName: cluster.get('name')})
        .then(function(indexes) {
          cluster.set('searchIndexes', indexes);

          cluster.get('searchIndexes');
        });
    } else {
      return cluster.get('searchIndexes');
    }
  },

  /**
   * Fetches a given log file and its dependencies
   *
   * @method getLogFile
   * @param {String} clusterName
   * @param {String} nodeName
   * @param {String} logName
   * @return {DS.Model} LogFile
   */
  getLogFile(clusterName, nodeName, logName) {
    let self = this;

    return this.getNode(clusterName, nodeName)
      .then(function(node) {
        return node.get('logFiles').findBy('name', logName);
      })
      .then(function(logFile) {
        return Ember.RSVP.allSettled([
          logFile,
          self.getLogFileContents(logFile),
          self.getLogFileLength(logFile)
        ]);
      })
      .then(function(PromiseArray) {
        let logFile = PromiseArray[0].value;

        return logFile;
      });
  },

  /**
   * Fetches and creates a set of log file for a given node.
   *
   * @method getLogFiles
   * @param {DS.Model} node
   * @return {DS.Array} LogFile
   */
  getLogFiles(node) {
    if (Ember.isEmpty(node.get('logFiles'))) {
      return this.store.query('log-file', {clusterName: node.get('cluster').get('name'), nodeName: node.get('name')})
        .then(function(logFiles) {
          node.set('logFiles', logFiles);

          return node.get('logFiles');
        });
    } else {
      return node.get('logFiles');
    }
  },

  /**
   * Fetches a given log files contents
   *
   * @method getLogFileContents
   * @param {DS.Model} log
   * @return {DS.Model} LogFile
   */
  getLogFileContents(log) {
    let clusterName = log.get('node').get('cluster').get('name');
    let nodeName    = log.get('node').get('name');
    let logName     = log.get('name');
    let url  = `${this.apiURL}explore/clusters/${clusterName}/nodes/${nodeName}/log/files/${logName}?rows=${this.pageSize}`;
    let self = this;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      let request = Ember.$.ajax({
        url: url,
        type: 'GET',
        headers: {
          Accept : "plain/text;"
        }
      });

      request.done(function(data) {
        log.set('content', data);
        log.set('pageSize', self.pageSize);

        resolve(log);
      });

      request.fail(function(data) {
        reject(data);
      });
    });
  },

  /**
   * Fetches and sets the amount of lines in a given log file
   *
   * @method getLogFileLength
   * @param {DS.Model} log
   * @return {DS.Model} LogFile
   */
  getLogFileLength(log) {
    let clusterName = log.get('node').get('cluster').get('name');
    let nodeName    = log.get('node').get('name');
    let logName     = log.get('name');
    let url  = `${this.apiURL}explore/clusters/${clusterName}/nodes/${nodeName}/log/files/${logName}`;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      let request = Ember.$.ajax({
        url: url,
        type: 'GET',
        dataType: 'json'
      });

      request.done(function(data) {
        let totalLines = data[logName].total_lines;

        log.set('totalLines', totalLines);

        resolve(log);
      });

      request.fail(function(data) {
        reject(data);
      });
    });
  },

  /**
   * Fetches a given node and all its basic dependencies: stats, configuration, and log files
   *
   * @method getNode
   * @param {String} clusterName
   * @param {String} nodeName
   * @return {DS.Model} Node
   */
  getNode(clusterName, nodeName) {
    let self = this;

    return this.getCluster(clusterName)
      .then(function(cluster) {
        return cluster.get('nodes').findBy('name', nodeName);
      })
      .then(function(node) {
        return Ember.RSVP.allSettled([
          node,
          self.getNodeStats(node),
          self.getNodeConfig(node),
          self.getLogFiles(node),
          self.getConfigFiles(node)
        ]);
      })
      .then(function(PromiseArray) {
        let node = PromiseArray[0].value;

        return node;
      });
  },

  /**
   * TODO: Make stats own model, flow through ember data
   * Fetches a given nodes basic configuration stats
   *
   * @method getNodeConfig
   * @param {DS.Model} node
   * @return {Object} result of the AJAX call
   */
  getNodeConfig(node) {
    let url = `${this.apiURL}explore/nodes/${node.get('name')}/config`;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      let request = Ember.$.ajax({
        url: url,
        type: 'GET'
      });

      request.done(function(data) {
        if (data.config.advanced_config) {
          node.set('advancedConfig', data.config.advanced_config);
        }

        if (data.config.config) {
          node.set('config', data.config.config);
        }

        resolve(data);
      });

      request.fail(function(data) {
        reject(data);
      });
    });
  },

  /**
   * Returns the results of a Riak node HTTP ping result.
   *
   * @method getNodePing
   * @param {String} nodeName
   * @return {Object} result of the AJAX call
   */
  getNodePing(nodeName) {
    let url = `${this.apiURL}riak/nodes/${nodeName}/ping`;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      let request = Ember.$.ajax({
        url: url,
        type: 'GET'
      });

      request.done(function(data) {
        resolve(data);
      });

      request.fail(function(data) {
        reject(data);
      });
    });
  },

  /**
   * Gets and sets the "status" property of each node in a cluster. Status is detrmined by whether or not
   *  the node's ring file is valid.
   *
   * @method getNodesStatus
   * @param {DS.Model} cluster
   * @return {Object} result of the AJAX call
   */
  getNodesStatus(cluster) {
    let url = `${this.apiURL}control/clusters/${cluster.get('name')}/status`;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      let request = Ember.$.ajax({
        url: url,
        type: 'GET'
      });

      request.done(function(data) {
        cluster.get('nodes').forEach(function(node) {
          let nodeName = node.get('name');
          let nodeStatus = data.status.nodes.findBy('id', nodeName).status;

          node.set('status', nodeStatus);
        });

        resolve(cluster);
      });

      request.fail(function(data) {
        reject(data);
      });
    });
  },

  /**
   * Returns all reachable nodes for a given cluster id
   *
   * @method getNodes
   * @param {DS.Model} cluster
   * @return {DS.Array} Node
   */
  getNodes(cluster) {
    if (Ember.isEmpty(cluster.get('nodes'))) {
      return this.store.query('node', {clusterName: cluster.get('name')})
        .then(function(nodes) {
          cluster.set('nodes', nodes);

          cluster.get('nodes');
        });
    } else {
      return cluster.get('nodes');
    }
  },

  /**
   * TODO: Make stats own model, flow through ember data
   * Gets and sets the node stats property. Returns the node model object.
   *
   * @method getNodeStats
   * @param {DS.Model} node
   * @return {DS.Model} Node
   */
  getNodeStats(node) {
    let url = `${this.apiURL}riak/nodes/${node.get('name')}/stats`;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      let request = Ember.$.ajax({
        url: url,
        type: 'GET'
      });

      request.done(function(data) {
        node.set('stats', data);

        resolve(node);
      });

      request.fail(function(data) {
        reject(data);
      });
    });
  },

  getObject(clusterName, bucketTypeName, bucketName, objectName) {
    let self = this;

    return this.getBucket(clusterName, bucketTypeName, bucketName)
      .then(function(bucket) {
        let isCRDT = !!(bucket.get('isCRDT'));

        return bucket.get('objects').findBy('name', objectName)
      })
      .then(function(riakObject) {
        return Ember.RSVP.allSettled([
          riakObject,
          self.getObjectContents(riakObject)
        ]);
      })
      .then(function(PromiseArray) {
        let riakObject = PromiseArray[0].value;

        return riakObject;
      });
  },

  // TODO: This can probably be ported over to be used the adapter findRecord
  //        method once moved over to ED 2.0 using the 'include' object
  //        Ref: https://github.com/emberjs/data/pull/3976
  getObjectContents(object) {
    let clusterUrl = object.get('cluster').get('proxyUrl');
    let bucketTypeName = object.get('bucketType').get('name');
    let bucketName = object.get('bucket').get('name');
    let objectName = object.get('name');
    let isCRDT = !!(object.get('bucket').get('isCRDT'));
    let url = (isCRDT)
      ? `${clusterUrl}/types/${bucketTypeName}/buckets/${bucketName}/datatypes/${objectName}`
      : `${clusterUrl}/types/${bucketTypeName}/buckets/${bucketName}/keys/${objectName}`;
    let xhrOptions = {
      url: url,
      type: 'GET',
      cache: false,
      headers: {'Accept': '*/*, multipart/mixed'},
      processData: !isCRDT
    };

    if (isCRDT) { xhrOptions.dataType = 'json'; }

    return new Ember.RSVP.Promise(function(resolve, reject) {
      let request = Ember.$.ajax(xhrOptions);

      request.done(function(data, textStatus, jqXHR) {
        let headerObj = parseHeader(jqXHR.getAllResponseHeaders());
        let content = (isCRDT) ? data : jqXHR.responseText;

        object.set('headers', headerObj);
        object.set('contents', content);
        object.set('url', url);

        resolve(object);
      });

      request.fail(function(data) {
        debugger;
      });
    });

    //return new Ember.RSVP.Promise(function(resolve, reject) {
    //
    //  if (bucket.get('props').get('isCRDT')) {
    //    ajaxHash.success = function(data, textStatus, jqXHR) {
    //
    //      headerString = jqXHR.getAllResponseHeaders();
    //      contents = data;  // Parsed json
    //
    //      resolve(explorer.createObjectFromAjax(key, bucket, headerString,
    //        contents, url));
    //    };
    //  } else {
    //    ajaxHash.success = function(data, textStatus, jqXHR) {
    //
    //      headerString = jqXHR.getAllResponseHeaders();
    //      contents = jqXHR.responseText;  // Unparsed payload
    //      resolve(explorer.createObjectFromAjax(key, bucket, headerString,
    //        contents, url));
    //    };
    //  }
    //
    //  ajaxHash.error = function(jqXHR, textStatus) {
    //    if (jqXHR.status === 200 && textStatus === 'parsererror') {
    //      // jQuery tries to parse JSON objects, and throws
    //      // parse errors when they're invalid. Suppress this.
    //      headerString = jqXHR.getAllResponseHeaders();
    //      resolve(explorer.createObjectFromAjax(key, bucket, headerString,
    //        jqXHR.responseText, url));
    //    }
    //    if (jqXHR.status === 300) {
    //      // Handle 300 Multiple Choices case for siblings
    //      headerString = jqXHR.getAllResponseHeaders();
    //      resolve(explorer.createObjectFromAjax(key, bucket, headerString,
    //        jqXHR.responseText, url));
    //    } else {
    //      reject(jqXHR);
    //    }
    //  };
    //  Ember.$.ajax(ajaxHash);
    //});
  },

  /**
   *
   * @method getObjectList
   * @param {DS.Model} bucket
   * @return {DS.Model} ObjectList
   */
  getObjectList(bucket) {
    let clusterName = bucket.get('cluster').get('name');
    let bucketTypeName = bucket.get('bucketType').get('name');
    let bucketName = bucket.get('name');
    let self = this;

    return this.store.queryRecord('object-list', { clusterName: clusterName, bucketTypeName: bucketTypeName, bucketName: bucketName })
      .then(
        function onSuccess(objectList) {
          bucket.set('objectList', objectList);
          bucket.set('isListLoaded', true);

          return bucket.get('objectList');
        },
        function onFail() {
          if (bucket.get('cluster').get('developmentMode')) {
            // kick off a cache refresh if in development mode and retry
            bucket.set('statusMessage', 'Cache not found. Refreshing from a streaming list keys call...');

            self.refreshObjectList(bucket).then(function() {
              self.getObjectList(bucket);
            });
          } else {
            // Let the UI know that the response has been completed
            bucket.set('isListLoaded', true);
          }
        }
      );
  },

  /**
   *
   * @method getObjects
   * @param {DS.Model} bucket
   * @return {DS.Array} RiakObject
   */
  getObjects(bucket) {
    if (Ember.isEmpty(bucket.get('objects'))) {
      let clusterName = bucket.get('cluster').get('name');
      let bucketTypeName = bucket.get('bucketType').get('name');
      let bucketName = bucket.get('name');

      return this.store.query('riak-object', { clusterName: clusterName, bucketTypeName: bucketTypeName, bucketName: bucketName})
        .then(function(objects) {
          bucket.set('objects', objects);

          return bucket.get('objects');
        });
    } else {
      return bucket.get('objects');
    }
  },

  /**
   *
   * @method getSearchSchema
   * @param {String} clusterName
   * @param {String} schemaName
   * @return {DS.Model} SearchSchema
   */
  getSearchSchema(clusterName, schemaName) {
    let self = this;

    return this.getCluster(clusterName)
      .then(function(cluster) {
        return cluster.get('searchSchemas').findBy('name', schemaName);
      })
      .then(function(schema) {
        return Ember.RSVP.allSettled([
          schema,
          self.getSearchSchemaContent(schema)
        ]);
      })
      .then(function(PromiseArray) {
        let schema = PromiseArray[0].value;

        return schema;
      });
  },

  /**
   *
   * @method getSearchSchemaContent
   * @param {DS.Model} schema
   * @return {String} schema.content
   */
  getSearchSchemaContent(schema) {
    if (!schema.get('content')) {

      let url = schema.get('url');

      return new Ember.RSVP.Promise(function(resolve, reject) {
        let request = Ember.$.ajax({
          url: url,
          type: 'GET',
          dataType: 'xml'
        });

        request.done(function(data) {
          let xmlString = (new XMLSerializer()).serializeToString(data);
          schema.set('content', xmlString);

          resolve(schema.get('content'));
        });

        request.fail(function(data) {
          reject(data);
        });
      });
    } else {
      return schema.get('content');
    }
  },

  /**
   * Pings all nodes in a given cluster and sets the nodes status
   *
   * @method getNodes
   * @param {DS.Model} cluster
   */
  pingNodes(cluster) {
    let self = this;

    this.getNodes(cluster).then(function(nodes) {
      nodes.forEach(function(node) {
        let nodeName = node.get('name');

        self.getNodePing(nodeName).then(function onSuccess(data) {
          node.set('available', true);
        }, function onFail(data) {
          node.set('available', false);
        });
      });
    });
  },

  /**
   * Checks node health in a given cluster, every 10 seconds
   *
   * @method pollNodes
   * @param {DS.Model} cluster
   */
  pollNodes(cluster) {
    let self = this;

    // This check makes sure that only one cluster can be polled at any given time
    if (!this._clusterRef || cluster.get('name') !== this._clusterRef.get('name')) {
      this._clusterRef = cluster;
    }

    Ember.run.later(this, function() {
      self.checkNodes(this._clusterRef);
      self.pollNodes(this._clusterRef);
    }, 10000);
  },

  /**
   *
   * @method refreshBucketList
   * @param {DS.Model} bucketType
   */
  refreshBucketList(bucketType) {
    let clusterName = bucketType.get('cluster').get('name');
    let bucketTypeName = bucketType.get('name');
    let url = `${this.apiURL}explore/clusters/${clusterName}/bucket_types/${bucketTypeName}/refresh_buckets/source/riak_kv`;
    let self = this;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      let request = Ember.$.ajax({
        url: url,
        type: 'POST'
      });

      request.complete(function(data) {
        self.getBucketList(bucketType);
        self.getBuckets(bucketType);
      });
    });
  },

  /**
   *
   * @method refreshObjectList
   * @param {DS.Model} bucket
   */
  refreshObjectList(bucket) {
    let clusterName = bucket.get('cluster').get('name');
    let bucketTypeName = bucket.get('bucketType').get('name');
    let bucketName = bucket.get('name');
    let url = `${this.apiURL}explore/clusters/${clusterName}/bucket_types/${bucketTypeName}/buckets/${bucketName}/refresh_keys/source/riak_kv`;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      let request = Ember.$.ajax({
        url: url,
        type: 'POST'
      });

      request.done(function(data) {
        resolve(data);
      });

      request.fail(function(jqXHR) {
        if (jqXHR.status === 202) {
          resolve(jqXHR.status);
        } else {
          reject(jqXHR);
        }
      });
    });
  },

  /**
   *
   * @method updateSchema
   * @param {DS.Model} schema
   * @param {XML.String} data
   */
  updateSchema(schema, data) {
    return Ember.$.ajax({
      type: 'PUT',
      url: schema.get('url'),
      contentType: 'application/xml',
      processData: false,
      data: data
    });
  },

  /**
   * Performs an update AJAX operation to the Riak Object
   *
   * @method updateDataType
   * @param {DS.Model} object
   * @param {String} operation
   */
  updateObject(object, operation) {
    let clusterUrl = object.get('cluster').get('proxyUrl');
    let bucketTypeName = object.get('bucketType').get('name');
    let bucketName = object.get('bucket').get('name');
    let objectName = object.get('name');
    let url = `${clusterUrl}/types/${bucketTypeName}/buckets/${bucketName}/datatypes/${objectName}`;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      let request = Ember.$.ajax({
        contentType: 'application/json',
        type: 'POST',
        dataType: 'json',
        url: url,
        data: JSON.stringify(operation)
      });

      request.done(function(data) {
        resolve(data);
      });

      request.fail(function(jqXHR) {
        if (jqXHR.status === 204) {
          resolve(jqXHR.status);
        } else {
          reject(jqXHR);
        }
      });
    });
  }
});


