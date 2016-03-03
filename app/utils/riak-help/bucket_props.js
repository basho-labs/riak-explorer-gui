let BucketPropsHelp = {
  "active": {
    "default": true,
    "description": "Has this bucket type been activated?",
    "editable": false,
    "json_schema_type": "boolean",
    "name": "Activated"
  },
  "allow_mult": {
    "default": true,
    "description": "Are siblings (multiple object versions) created during write conflicts that cannot be automatically resolved?",
    "editable": true,
    "json_schema_type": "boolean",
    "name": "Siblings Enabled"
  },
  "backend": {
    "default": "*",
    "description": "Name of the custom backend (specified in Riak config) to use for this bucket.",
    "editable": true,
    "json_schema_type": "string",
    "name": "Custom Data Backend"
  },
  "basic_quorum": {
    "default": false,
    "description": "The Basic Quorum optimization will short-circuit fetches where the majority of replicas report that the key is not found. Only used when notfound_ok is set to false, to reduce latency in read-heavy cases.",
    "editable": true,
    "json_schema_type": "boolean",
    "name": "Basic Quorum"
  },
  "big_vclock": {
    "default": 50,
    "description": "If the length of the vector clock list is larger than this value, the list will be pruned.",
    "editable": true,
    "json_schema_type": "integer",
    "name": "Big VClock Pruning"
  },
  "chash_keyfun": {
    "default": {
      "fun": "chash_std_keyfun",
      "mod": "riak_core_util"
    },
    "description": "(Deprecated) Consistent Hashing function",
    "editable": false,
    "json_schema_type": "object",
    "name": "Consistent Hash Function"
  },
  "claimant": {
    "default": "riak@127.0.0.1",
    "description": "The id of the node responsible for processing cluster-wide operations (such as adding or removing nodes, creating bucket types, or re-distributing partitions).",
    "editable": false,
    "json_schema_type": "string",
    "name": "Claimant Node"
  },
  "datatype": {
    "default": "*",
    "description": "Has this bucket been created to store Riak Data Types (CRDTs)?",
    "editable": false,
    "json_schema_type": "string",
    "name": "Data Type (CRDT)",
    "valid_options": [
      ["counter", "Counter"],
      ["map", "Map"],
      ["set", "Set"]
    ]
  },
  "dvv_enabled": {
    "default": "false",
    "description": "Are Dotted Version Vectors used for conflict resolution instead of the older mechanism, Vector Clocks? Should be set to true if using Siblings.",
    "editable": true,
    "json_schema_type": "boolean",
    "name": "DVV Enabled"
  },
  "dw": {
    "default": "quorum",
    "description": "The number of replicas which must be not only acknowledged by the receiving virtual node, but also acknowledged as received by the backend for the write to be deemed successful.",
    "editable": true,
    "json_schema_type": "integer|string",
    "name": "Durable Write Quorum"
  },
  "last_write_wins": {
    "default": "false",
    "description": "Code shortcut - if true, Riak will ignore Causal Context (Vclocks or DVVs) and only use the timestamp to resolve write conflicts. Only useful if you don't anticipate concurrent writes/edits to the same object (and even then, use 'write_once' instead).",
    "editable": true,
    "json_schema_type": "boolean",
    "name": "Last Write Wins (LWW)"
  },
  "linkfun": {
    "default": {
      "fun": "mapreduce_linkfun",
      "mod": "riak_kv_wm_link_walker",
    },
    "description": "(Deprecated) Link walking function",
    "editable": false,
    "json_schema_type": "object",
    "name": "Link Walking"
  },
  "n_val": {
    "default": 3,
    "description": "The number of copies of each object to be stored in the cluster.",
    "editable": true,
    "json_schema_type": "integer",
    "name": "Number of Replicas (N_Val)"
  },
  "name": {
    "default": "*",
    "description": "Bucket or Bucket Type name (id)",
    "json_schema_type": "string",
    "editable": false,
    "name": "Name"
  },
  "notfound_ok": {
    "default": true,
    "description": "If set to true, if the first virtual node to respond doesn't have a copy of the object, Riak will deem the failure authoritative and immediately return a NotFound error to the client. If set to false, instructs the coordinating node to wait for something other than a NotFound error before reporting a value.",
    "editable": true,
    "json_schema_type": "boolean",
    "name": "Not Found OK"
  },
  "old_vclock": {
    "default": 86400,
    "description": "If a vector clock entry is older than this value (in milliseconds), it will be pruned. Default: 86400 milliseconds (one day).",
    "editable": true,
    "json_schema_type": "integer",
    "name": "Old VClock Pruning"
  },
  "postcommit": {
    "default": [],
    "description": "A list of custom Erlang post-commit functions to be called after an object is written, immediately before the calling process is notified of the successful write. Each function runs in a separate process, in parallel. All are executed for each create, update, or delete.",
    "editable": true,
    "json_schema_type": "array",
    "name": "Post-Commit Hooks"
  },
  "pr": {
    "default": 0,
    "description": "How many primary partitions must respond to a Read request in order to report success to the client. Setting it to a non-zero value increases consistency, at the cost of availability and tolerance for unavailable nodes.",
    "editable": true,
    "json_schema_type": "integer|string",
    "name": "Primary Read Quorum"
  },
  "precommit": {
    "default": [],
    "description": "A list of custom Erlang pre-commit functions to be called before an object is written. Riak stops evaluating pre-commit hooks when a hook function fails the commit, and prevents the object from being written.",
    "editable": true,
    "json_schema_type": "array",
    "name": "Pre-Commit Hooks"
  },
  "pw": {
    "default": 0,
    "description": "How many primary partitions must respond to a Write request in order to report success to the client. Setting it to a non-zero value increases consistency, at the cost of availability and tolerance for unavailable nodes.",
    "editable": true,
    "json_schema_type": "integer|string",
    "name": "Primary Write Quorum"
  },
  "r": {
    "default": "quorum",
    "description": "The number of vnodes which must respond to a read (R) request before a response is returned to a client.",
    "editable": true,
    "json_schema_type": "integer|string",
    "name": "Read Quorum"
  },
  "repl": {
    "default": "*",
    "description": "Has Multi Data Center Replication been enabled for this bucket?",
    "editable": true,
    "json_schema_type": "boolean|string",
    "name": "Per-Bucket MDC Replication",
    "valid_options": [
      [true, "Both Realtime and Fullsync"],
      [false, "Not replicated"],
      ["fullsync", "Fullsync Only"],
      ["realtime", "Realtime Only"]
    ]
  },
  "rw": {
    "default": "quorum",
    "description": "(Deprecated) Was used as a delete quorum parameter for when R and W values are undefined.",
    "editable": true,
    "json_schema_type": "integer|string",
    "name": "Delete Quorum"
  },
  "search": {
    "default": false,
    "description": "(Deprecated) Is Legacy Riak Search (v1.4 and earlier) indexing enabled?",
    "editable": true,
    "json_schema_type": "boolean",
    "name": "Legacy Search Enabled"
  },
  "search_index": {
    "default": "*",
    "description": "Name (id) of the Search index that Solr will be using to index objects in this bucket.",
    "editable": true,
    "json_schema_type": "string",
    "name": "Search Index Name"
  },
  "small_vclock": {
    "default": 50,
    "description": "If the length of the vector clock list is smaller than this value, the list's entries will not be pruned.",
    "editable": true,
    "json_schema_type": "integer",
    "name": "Small VClock Pruning"
  },
  "w": {
    "default": "quorum",
    "description": "The number of vnodes which must respond to a write (W) request before a response is returned to a client.",
    "editable": true,
    "json_schema_type": "integer|string",
    "name": "Write Quorum"
  },
  "write_once": {
    "default": "false",
    "description": "Write-optimized (for immutable data only) setting enabled for this bucket?",
    "editable": true,
    "json_schema_type": "boolean",
    "name": "Write-Optimized"
  },
  "young_vclock": {
    "default": 20,
    "description": "If a vector clock entry is younger than this value (in milliseconds), it will not be pruned.",
    "editable": true,
    "json_schema_type": "integer",
    "name": "Young VClock Pruning"
  }
};

export default BucketPropsHelp;
