# Riak Explorer GUI

This is the GUI component of the [Riak Explorer](https://github.com/basho-labs/riak_explorer)
project.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://www.ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

Also, it will need [Riak KV](http://basho.com/products/riak-kv/) installed
and running, as well as the [Riak Explorer
API](https://github.com/basho-labs/riak_explorer).
See the [Explorer
API Dev Instructions](https://github.com/basho-labs/riak_explorer/blob/master/DEVELOPMENT.md)
for more details.

## Installing Ember pre-requisites

* `git clone <repository-url>` this repository
* `cd` into this new directory
* `npm install`
* `bower install`

## Running / Development

Unfortunately, for the moment we're unable to have this app work with the built-
in Ember dev server (the one you get by running `ember server`). Instead, the
development cycle is as follows:

1. Run `make`. This compiles everything in the Ember
    build pipeline, and copies it into the local `dist/` directory.

2. Copy the contents of the build from the local `dist/` into Riak Explorer API's
    `dist/` directory.

3. Refresh the browser to see changes, as usual.

For example, if your riak_explorer repo is located at
`/Users/yourusername/code/riak_explorer`, you can do:

```bash
export EXPLORER_PATH=/Users/yourusername/code/riak_explorer

cp -R dist/* $EXPLORER_PATH/priv/ember_riak_explorer/dist
```

Then, during subsequent development, you can just run:

```bash
make recompile && cp -R dist/* $EXPLORER_PATH/priv/ember_riak_explorer/dist
```

(#TODO - consider moving `$EXPLORER_PATH` into the `Makefile`?)

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

(Default Ember doc copy)

* `ember test`
* `ember test --server`

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
