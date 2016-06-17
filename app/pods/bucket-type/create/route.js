import Ember from 'ember';
import Alerts from '../../../mixins/routes/alerts';
import LoadingSlider from '../../../mixins/routes/loading-slider';
import ScrollReset from '../../../mixins/routes/scroll-reset';
import WrapperState from '../../../mixins/routes/wrapper-state';

export default Ember.Route.extend(Alerts, LoadingSlider, ScrollReset, WrapperState, {
  model: function(params) {
    let self = this;

    return this.explorer.getCluster(params.clusterName).then(function(cluster) {
      return self.store.createRecord('bucket-type', {
        cluster: cluster,
        name: ''
      });
    });
  },

  afterModel: function(model, transition) {
    this.setSidebarCluster(model.get('cluster'));
    this.setBreadCrumbs({
      cluster: model.get('cluster'),
      crudAction: 'create bucket type'
    });
    this.setViewLabel({
      preLabel: 'Create Bucket Type'
    });
    this.simulateLoad();
  },

  setupController: function(controller, model) {
    this._super(controller, model);

    controller.clearState();
  },

  prepareBucketType: function() {
    let controller = this.controller;
    let btName = this.currentModel.get('name').trim().replace(/ /g,"_");
    let btProps = controller.get('properties');
    let btType = controller.get('dataType');
    let bucketType = {
      name: btName,
      data: {
        props: {}
      }
    };

    btProps.forEach(function(prop) {
      bucketType.data.props[prop.key] = prop.value;
    });

    if (btType !== 'default') {
      bucketType.data.props.datatype = btType;
    }

    return bucketType;
  },

  validatePresenceAndUniquenessOfName: function() {
    let controller = this.controller;
    let bucketType = this.currentModel;
    let cluster = bucketType.get('cluster');
    let name = bucketType.get('name').trim().replace(/ /g,"_");

    let isValid;

    if (Ember.isBlank(name)) {
      controller.errors.pushObject('Bucket Types must have a name.');
      isValid = false;
    } else if (cluster.get('bucketTypes').filterBy('name', name).length > 1) {
      controller.errors.pushObject(`The ${cluster.get('name')} cluster already has a bucket type called "${name}".`);
      isValid = false;
    } else {
      isValid = true;
    }

    return isValid;
  },

  validateProperties: function() {
    let controller = this.controller;
    let props = controller.get('properties');
    let errors = controller.get('errors');
    let invalidProps = props.filter(function(prop) {
      return (Ember.isBlank(prop.key) || Ember.isBlank(prop.value));
    });
    let isValid;

    if (Ember.isPresent(invalidProps)) {
      errors.pushObject('All properties must contain non-empty keys and values');
      isValid = false;
    } else {
      isValid = true;
    }

    return isValid;
  },

  validateBucketType: function() {
    this.controller.set('errors', []);

    let validName = this.validatePresenceAndUniquenessOfName();
    let validProps = this.validateProperties();

    return (validName && validProps);
  },

  actions: {
    willTransition: function() {
      let bucketType = this.currentModel;

      // Destroy in memory model.
      // If the bucket-type is successfully created, it will be saved through the normal Ember Data flow.
      bucketType.destroyRecord();
    },

    createBucketType: function() {
      let self = this;
      let controller = this.controller;
      let cluster = this.currentModel.get('cluster');
      let isValid = this.validateBucketType();

      if (isValid) {
        controller.set('spinnerMessage', 'Creating Bucket-Type ...');
        controller.set('showSpinner', true);

        let bucketType = this.prepareBucketType();

        this.explorer.createBucketType(cluster.get('name'), bucketType).then(
          function onSuccess(data) {
            self.transitionTo('bucket-type', cluster.get('name'), bucketType.name).then(function() {
              controller.set('showSpinner', false);
            });
          },

          function onFail(data) {
            controller.set('showSpinner', false);

            self.render('alerts.error-request-was-not-processed', {
              into: 'application',
              outlet: 'alert'
            });
          }
        );
      }
    }
  }
});
