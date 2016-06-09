# Riak Explorer GUI

[![Build Status](https://travis-ci.org/basho-labs/riak-explorer-gui.svg?branch=master)](https://travis-ci.org/basho-labs/riak-explorer-gui)
[![License](https://img.shields.io/badge/license-apache-blue.svg?style=flat)](http://www.apache.org/licenses/LICENSE-2.0.html)
[![Join the chat at https://gitter.im/basho-labs/riak-explorer-gui](https://badges.gitter.im/basho-labs/riak-explorer-gui.svg)](https://gitter.im/basho-labs/riak-explorer-gui?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

This is the GUI component of the [Riak Explorer](https://github.com/basho-labs/riak_explorer)
project.

If you would like to see a demo of a explorer running on a simple one node cluster, [click here](http://104.236.156.86/). 
If you would like to try it out on one of your own clusters, follow the [Riak Explorer install Instructions](https://github.com/basho-labs/riak_explorer#installation)
For development instructions, see below.


## Development Prerequisites

This app uses the [Ember.JS](http://emberjs.com/) framework. You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://www.ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

In addition to the front-end dependencies required, [Riak KV or Riak TS](http://docs.basho.com/) must be installed
and running, as well as the [Riak Explorer Backend](https://github.com/basho-labs/riak_explorer).
See the [Riak Explorer development instructions](https://github.com/basho-labs/riak_explorer/blob/master/DEVELOPMENT.md) for more details.

## Installing Ember pre-requisites

* `git clone <repository-url>` this repository
* `cd` into this new directory
* `npm install`
* `bower install`

## Running / Development

To get the Ember dev server to communicate with the riak_explorer api, we have to use a proxy server to catch all api requests
and alter the port. Assuming riak_explorer is running on port `9000` and the Ember server on port
`4200`, you can set up some rewrite rules to handle these cases. If using [Charles Proxy](http://www.charlesproxy.com/),
make sure your network is allowing a proxy server and create the following url rewrite rules:
 - Match `:4200/explore` Replace: `:9000/explore`
 - Match `:4200/riak`    Replace: `:9000/riak`
 - Match `:4200/control` Replace: `:9000/control`

If you don't want to use a proxy server to intercept and alter requests, you can also build the project and copy it over
to the riak_explorer `dist` directory:

1. Run `make`. This compiles everything in the Ember
    build pipeline, and copies it into the local `dist/` directory.

2. Copy the contents of the build from the local `dist/` into Riak Explorer API's
    `dist/` directory.

3. Refresh the browser to see changes, as usual. The URL for the Ember app
    is served on the same port as the Explorer API (port `9000`, by default).

For example, if your riak_explorer repo is located at
`/Users/yourusername/code/riak_explorer`, you can do:

```bash
export EXPLORER_PATH=/Users/yourusername/code/riak_explorer

make recompile

cp -R dist/* $EXPLORER_PATH/priv/ember_riak_explorer/dist
```

## Notes to Ember.js Developers

This project uses Ember 2.0+ and Ember Data, and attempts to follow current Ember conventions. The app uses "pod" architecture for 
most resources, though there are some standalone routes and models.

### Ember Data and Riak Explorer

All resources are flowing through Ember Data in the application. Riak and Ember Data do not mesh well together in two areas:

1. None of the Riak HTTP API results are in JSON-API format (no unique IDs, etc). The situation is slightly better on 
   Explorer endpoints (since we can change those a lot more easily than we can the actual Riak API), we can put at least 
   *some* of them in JSON-API format. Due to these api format limitations, we heavily use Ember Data Serializers to 
   format our responses correctly.

2. Ember Data assumes flat URLs, with unique IDs. Whereas both Riak and Explorer
   have deeply nested URLs, with what essentially are "compound keys", in RDBMS
   language. Because resource id's are required for Ember Data to function, we assign the compound key as the id in the
   resources Ember Data Adapter. A side effect of this decision, is that we can not load child resources without loading
   the objects parent resource. To ensure a resource call will correctly load its parent resource, the application heavily uses the [explorer
   service](https://github.com/basho-labs/riak-explorer-gui/blob/master/app/services/explorer.js), which is injected into all routes.
    

### Generating Documentation

This project uses [YUIDoc](http://yui.github.io/yuidoc/) to annotate comments
in the source code, and [ember-cli-yuidoc](https://github.com/cibernox/ember-cli-yuidoc)
to auto-generate documentation from it. Run:

```
ember ember-cli-yuidoc
```

And the docs will be generated in the `docs/` directory.

### Running Tests

Testing requires that [phantomjs](http://phantomjs.org/) is installed on your local machine.

To run the test suite:
* `ember test`

To run the test suite with watcher and ability to view tests in browser:
* `ember test --server`
* In the browser visit: [http://localhost:7357/](http://localhost:7357/)

### Building

(Default Ember doc copy)

* `ember build` (development)
* `ember build --environment production` (production)

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](http://www.ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
