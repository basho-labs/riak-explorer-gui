import Ember from 'ember';
import Config from '../config/environment';
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
  pageSize: Config.pageSize,

  /**
   *
   * @method associateSchemasWithIndexes
   * @param {DS.Model} cluster
   */
  _associateSchemasWithIndexes(cluster) {
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

  _refreshCacheList(resource, url) {
    resource.set('isListLoaded', false);
    resource.set('hasListBeenRequested', true);

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
          resource.set('hasListBeenRequested', false); // Since the request failed, set value to false
          reject(jqXHR);
        }
      });
    });
  },

  _getCacheList(type, params, owner, propertyName) {
    return this.store.queryRecord(type, params)
      .then(
        function onSuccess(list) {
          owner.set('isListLoaded', true);
          owner.set(propertyName, list);

          return owner.get(propertyName);
        }
      );
  },

  _getResourceProps(resource, url) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      let request = Ember.$.ajax({
        url: url,
        type: 'GET'
      });

      request.done(function(data) {
        resource.set('props', data.props);

        resolve(data);
      });

      request.fail(function(data) {
        reject(data);
      });
    });
  },

  _getResources(type, params, owner, propertyName) {
    return this.store.query(type, params)
      .then(function(resources) {
        owner.set(propertyName, resources);

        return owner.get(propertyName);
      });
  },

  // TODO: Have JSON stringify happen here
  _putResource(url, data, type='application/json') {
    return Ember.$.ajax({
      type: 'PUT',
      url: url,
      contentType: type,
      data: data
    });
  },

  _postResource(url, data) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      let request = Ember.$.ajax({
        contentType: 'application/json',
        type: 'POST',
        dataType: 'json',
        url: url,
        data: JSON.stringify(data)
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
  },

  /**
   * Checks availability and validity of nodes in a given cluster.
   *
   * @method monitorCluster
   * @param {DS.Model} cluster
   */
  _monitorCluster(cluster) {
    // Ping each node in cluster
    this.pingNodes(cluster);
    // Get status of each node in cluster
    this.getNodesStatus(cluster);
    // Get node statistics for historical analysis
    this.getNodesStats(cluster);
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

    return this._putResource(url, data, 'application/xml');
  },

  createBucketType(clusterName, bucketType) {
    let url = `/explore/clusters/${clusterName}/bucket_types/${bucketType.name}`;
    let data = JSON.stringify(bucketType.data);

    return this._putResource(url, data);
  },

  createCRDT(clusterName, bucketTypeName, bucketName, objectName, data) {
    let url = `riak/clusters/${clusterName}/types/${bucketTypeName}/buckets/${bucketName}/datatypes/${objectName}`;

    return this._postResource(url, data);
  },

  // TODO: Get Resource
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
          self.getBucketProps(bucket),
          self.getObjects(bucket),
          self.getObjectList(bucket)
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
    let type = 'bucket-list';
    let params = {
      clusterName:  bucketType.get('cluster').get('name'),
      bucketTypeName: bucketType.get('name')
    };
    let owner = bucketType;
    let propertyName = 'bucketList';


    return this._getCacheList(type, params, owner, propertyName);
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

    return this._getResourceProps(bucket, url);
  },

  /**
   *
   * @method getBuckets
   * @param {DS.Model} bucketType
   * @return {DS.Array} Bucket
   */
  getBuckets(bucketType) {
    let type = 'bucket';
    let params = {
      clusterName: bucketType.get('cluster').get('name'),
      bucketTypeName: bucketType.get('name')
    };
    let owner = bucketType;
    let proertyName = 'buckets';

    return this._getResources(type, params, owner, proertyName);
  },

  // TODO: Get Resource
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
          self.getBuckets(bucketType),
          self.getBucketList(bucketType)
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
    let type = 'bucket-type';
    let params = {
      clusterName: cluster.get('name')
    };
    let owner = cluster;
    let propertyName = 'bucketTypes';

    return this._getResources(type, params, owner, propertyName);
  },

  // TODO: Get Resource
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
    let type = 'config-file';
    let params = {
      clusterName: node.get('cluster').get('name'),
      nodeName: node.get('name')
    };
    let owner = node;
    let propertyName = 'configFiles';

    return this._getResources(type, params, owner, propertyName);
  },

  // TODO: Refactor with similar
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
    let url  = `explore/clusters/${clusterName}/nodes/${nodeName}/config/files/${configName}`;

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

  // TODO: Get Resource
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
          self.getNodes(cluster),
          self.getTables(cluster)
        ]);
      })
      .then(function(PromiseArray) {
        let cluster = PromiseArray[0].value;

        if (!cluster.hasBeenInitialized) {
          // Create search-schemas from index references
          self._associateSchemasWithIndexes(cluster);

          // Check on node health of the cluster
          self._monitorCluster(cluster);

          // Continue to check on node health
          self.pollCluster(cluster);
        }

        cluster.hasBeenInitialized = true;

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

  // TODO: Get Resource (Use this as a base template
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
      });
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
    let type = 'search-index';
    let params = {
      clusterName: cluster.get('name')
    };
    let owner = cluster;
    let propertyName = 'searchIndexes';

    return this._getResources(type, params, owner, propertyName);
  },

  // TODO: Get Resource
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
    let type = 'log-file';
    let params = {
      clusterName: node.get('cluster').get('name'),
      nodeName: node.get('name')
    };
    let owner = node;
    let propertyName = 'logFiles';

    return this._getResources(type, params, owner, propertyName);
  },

  // TODO: Refactor with similar
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
    let url  = `explore/clusters/${clusterName}/nodes/${nodeName}/log/files/${logName}?rows=${this.pageSize}`;
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

  // TODO: Refactor with similar
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
    let url  = `explore/clusters/${clusterName}/nodes/${nodeName}/log/files/${logName}`;

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

  // TODO: Get Resource
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

  // TODO: Refactor with similar
  /**
   * Fetches a given nodes basic configuration stats
   *
   * @method getNodeConfig
   * @param {DS.Model} node
   * @return {Object} result of the AJAX call
   */
  getNodeConfig(node) {
    let url = `explore/nodes/${node.get('name')}/config`;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      let request = Ember.$.ajax({
        url: url,
        type: 'GET'
      });

      request.done(function(data) {
        if (data.config.advanced_config) {
          let advancedConfig = data.config.advanced_config.map(function(configString) {
              return configString.split(',').join(', ');
          });

          node.set('advancedConfig', advancedConfig);
        }

        if (data.config.config) {
          let alphaSortedConfig = {};

          Object.keys(data.config.config).sort().forEach(function(key) {
            alphaSortedConfig[key] = data.config.config[key];
          });

          node.set('config', alphaSortedConfig);
        }

        resolve(data);
      });

      request.fail(function(data) {
        reject(data);
      });
    });
  },

  // TODO: Refactor with similar
  /**
   * Returns the results of a Riak node HTTP ping result.
   *
   * @method getNodePing
   * @param {String} nodeName
   * @return {Object} result of the AJAX call
   */
  getNodePing(nodeName) {
    let url = `riak/nodes/${nodeName}/ping`;

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

  // TODO: Refactor with similar
  getNodeReplicationStatus(node) {
    let url = `control/nodes/${node.get('name')}/status`;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      let request = Ember.$.ajax({
        url: url,
        type: 'GET'
      });

      request.done(function(data) {
        let additionalNodeStats = data.status.nodes.findBy('id', node.get('name'));

        delete additionalNodeStats.id;
        delete data.status.nodes;

        let nodeReplStatus = Ember.merge(data.status, additionalNodeStats);

        node.set('replStatus', nodeReplStatus);

        resolve(data);
      });

      request.fail(function(data) {
        reject(data);
      });
    });
  },

  // TODO: Refactor with similar
  /**
   * Gets and sets the "status" property of each node in a cluster. Status is detrmined by whether or not
   *  the node's ring file is valid.
   *
   * @method getNodesStatus
   * @param {DS.Model} cluster
   * @return {Object} result of the AJAX call
   */
  getNodesStatus(cluster) {
    let url = `control/clusters/${cluster.get('name')}/status`;

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
    let type = 'node';
    let params = {
      clusterName: cluster.get('name')
    };
    let owner = cluster;
    let propertyName = 'nodes';

    return this._getResources(type, params, owner, propertyName);
  },

  getNodesStats(cluster) {
    let self = this;

    return Ember.RSVP.allSettled(
      cluster.get('nodes').map(function(node) {
        return self.getNodeStats(node);
      })
    );
  },

  // TODO: Refactor with similar
  /**
   * Gets and sets the node stats property. Returns the node model object.
   *
   * @method getNodeStats
   * @param {DS.Model} node
   * @return {DS.Model} Node
   */
  getNodeStats(node) {
    let url = `riak/nodes/${node.get('name')}/stats`;

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

  // TODO: Get Resource
  getObject(clusterName, bucketTypeName, bucketName, objectName) {
    let self = this;

    return this.getBucket(clusterName, bucketTypeName, bucketName)
      .then(function(bucket) {
        return bucket.get('objects').findBy('name', objectName);
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

  getObjectContents(object)   {
    let clusterUrl = object.get('cluster').get('proxyUrl');
    let bucketTypeName = object.get('bucketType').get('name');
    let bucketName = object.get('bucket').get('name');
    let objectName = object.get('name');
    let isCRDT = !!(object.get('bucket').get('isCRDT'));
    let url = (isCRDT) ? `${clusterUrl}/types/${bucketTypeName}/buckets/${bucketName}/datatypes/${objectName}` : `${clusterUrl}/types/${bucketTypeName}/buckets/${bucketName}/keys/${objectName}`;
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
        let type    = (isCRDT) ? data.type : 'default';
        let content = (isCRDT) ? data.value : data;

        object.set('headers', headerObj);
        object.set('type', type);
        object.set('contents', content);
        object.set('url', url);

        resolve(object);
      });

      request.fail(function(data) {
        reject(data);
      });
    });
  },

  /**
   *
   * @method getObjectList
   * @param {DS.Model} bucket
   * @return {DS.Model} ObjectList
   */
  getObjectList(bucket) {
    let type = 'object-list';
    let params = {
      clusterName: bucket.get('cluster').get('name'),
      bucketTypeName: bucket.get('bucketType').get('name'),
      bucketName: bucket.get('name')
    };
    let owner = bucket;
    let propertyName = 'objectList';

    return this._getCacheList(type, params, owner, propertyName);
  },

  /**
   *
   * @method getObjects
   * @param {DS.Model} bucket
   * @return {DS.Array} RiakObject
   */
  getObjects(bucket) {
    let type = 'riak-object';
    let params = {
      clusterName: bucket.get('cluster').get('name'),
      bucketTypeName: bucket.get('bucketType').get('name'),
      bucketName: bucket.get('name')
    };
    let owner = bucket;
    let propertyName = 'objects';

    return this._getResources(type, params, owner, propertyName);
  },

  // TODO: Get Resource
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

  // TODO: Refactor with similar
  /**
   *
   * @method getSearchSchemaContent
   * @param {DS.Model} schema
   * @return {String} schema.content
   */
  getSearchSchemaContent(schema) {
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
  },

  // TODO: Get Resource
  /**
   *
   * @method getTab;e
   * @param {String} clusterName
   * @param {String} tableName
   * @return {DS.Model} Table
   */
  getTable(clusterName, tableName) {
    let self = this;

    return this.getCluster(clusterName)
      .then(function(cluster) {
      return cluster.get('tables').findBy('name', tableName);
    }).then(function(table) {
      return Ember.RSVP.allSettled([
        table,
        self.getTableRows(table),
        self.getTableRowsList(table)
      ]);
    }).then(function(PromiseArray) {
      let table = PromiseArray[0].value;

      return table;
    });
  },

  getTableRows(table) {
    let type = 'row';
    let params = {
      clusterName: table.get('cluster').get('name'),
      tableName: table.get('name')
    };
    let owner = table;
    let propertyName = 'rows';

    return this._getResources(type, params, owner, propertyName);
  },

  getTableRowsList(table) {
    let type = 'row-list';
    let params = {
      clusterName: table.get('cluster').get('name'),
      tableName: table.get('name')
    };
    let owner = table;
    let propertyName = 'rowsList';

    return this._getCacheList(type, params, owner, propertyName);
  },

  /**
   * Returns all the TS Tables that belong to the specified cluster.
   *
   * @method getTables
   * @param {DS.Model} cluster
   * @return {DS.Array} Table
   */
  getTables(cluster) {
    let type = 'table';
    let params = {
      clusterName: cluster.get('name')
    };
    let owner = cluster;
    let propertyName = 'tables';

    return this._getResources(type, params, owner, propertyName);
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
   * @method pollCluster
   * @param {DS.Model} cluster
   */
  pollCluster(cluster) {
    let self = this;

    // This check makes sure that only one cluster can be polled at any given time
    if (!this._clusterRef || cluster.get('name') !== this._clusterRef.get('name')) {
      this._clusterRef = cluster;
    }

    Ember.run.later(this, function() {
      self._monitorCluster(this._clusterRef);
      self.pollCluster(this._clusterRef);
    }, 10000);
  },

  // TODO: Can we just use this._postResource???
  queryTable(table, data) {
    let clusterName = table.get('cluster').get('name');
    let url = `/explore/clusters/${clusterName}/tables/query`;

    return Ember.$.ajax({
      type: 'POST',
      url: url,
      data: data
    });
  },

  /**
   *
   * @method refreshBucketList
   * @param {DS.Model} bucketType
   */
  refreshBucketList(bucketType) {
    let clusterName = bucketType.get('cluster').get('name');
    let bucketTypeName = bucketType.get('name');
    let url = `explore/clusters/${clusterName}/bucket_types/${bucketTypeName}/refresh_buckets/source/riak_kv`;

    return this._refreshCacheList(bucketType, url);
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
    let url = `explore/clusters/${clusterName}/bucket_types/${bucketTypeName}/buckets/${bucketName}/refresh_keys/source/riak_kv`;

    return this._refreshCacheList(bucket, url);
  },

  refreshTableRowsList(table) {
    let clusterName = table.get('cluster').get('name');
    let tableName = table.get('name');
    let url = `explore/clusters/${clusterName}/tables/${tableName}/refresh_keys/source/riak_kv`;

    return this._refreshCacheList(table, url);
  },

  updateBucketType(bucketType, props) {
    let clusterName = bucketType.get('cluster').get('name');
    let bucketTypeName = bucketType.get('name');
    let data = { props: props };
    let url = `/explore/clusters/${clusterName}/bucket_types/${bucketTypeName}`;

    return this._putResource(url, JSON.stringify(data));
  },

  /**
   * Performs an update AJAX operation to the Riak Object
   *
   * @method updateDataType
   * @param {DS.Model} object
   * @param {String} operation
   */
  updateCRDT(object, operation) {
    let clusterUrl = object.get('cluster').get('proxyUrl');
    let bucketTypeName = object.get('bucketType').get('name');
    let bucketName = object.get('bucket').get('name');
    let objectName = object.get('name');
    let url = `${clusterUrl}/types/${bucketTypeName}/buckets/${bucketName}/datatypes/${objectName}`;

    return this._postResource(url, operation);
  },

  // TODO: Refactor to similar
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

  updateTable(table, data) {
    let clusterName = table.get('cluster').get('name');
    let tableName = table.get('name');
    let url = `/explore/clusters/${clusterName}/tables/${tableName}`;

    return this._putResource(url, JSON.stringify(data));
  }
});
