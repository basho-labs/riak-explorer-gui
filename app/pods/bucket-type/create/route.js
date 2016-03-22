import Ember from 'ember';
import Alerts from '../../../mixins/routes/alerts';
import LoadingSlider from '../../../mixins/routes/loading-slider';
import ScrollReset from '../../../mixins/routes/scroll-reset';
import WrapperState from '../../../mixins/routes/wrapper-state';

export default Ember.Route.extend(Alerts, LoadingSlider, ScrollReset, WrapperState, {
  model: function(params) {
    return this.explorer.getCluster(params.clusterName);
  },

  afterModel: function(model, transition) {
    this.setSidebarCluster(model);
    this.setBreadCrumbs({
      cluster: model,
      bucketTypeCreate: true
    });
    this.setViewLabel({
      preLabel: 'Create Bucket Type'
    });
    this.simulateLoad();
  },

  prepareBucketType: function() {
    let controller = this.controllerFor('bucket-type.create');
    let btProps = controller.get('properties');
    let btType = controller.get('dataType');
    let btName = controller.get('bucketTypeName');
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
    let controller = this.controllerFor('bucket-type.create');
    let cluster = this.currentModel;
    let name = controller.get('bucketTypeName').trim(); // Trim any trailing whitespace
    let isValid = true;

    if (Ember.isBlank(name)) {
      controller.errors.pushObject('Bucket Types must have a name.');
      isValid = false;
    }

    if (cluster.get('bucketTypes').mapBy('name').indexOf(name) !== -1) {
      controller.errors.pushObject(`"${cluster.get('name')}" already has a bucket type called "${name}".`);
      isValid = false;
    }

    return isValid;
  },

  validateProperties: function() {
    let controller = this.controllerFor('bucket-type.create');
    let props = controller.get('properties');
    let errors = controller.get('errors');
    let validProps = true;

    props.forEach(function(prop) {
      let key = prop.key;
      let value = prop.value;

      // Prop with key or value missing
      if (Ember.isBlank(key) || Ember.isBlank(value)) {
        errors.pushObject('All properties must contain non-empty keys and values');
        validProps = false;
        return false;
      }
    });

    return validProps;
  },

  validateBucketType: function() {
    let controller = this.controllerFor('bucket-type.create');

    controller.set('errors', []);

    let validName = this.validatePresenceAndUniquenessOfName();
    let validProps = this.validateProperties();

    return (validName && validProps);
  },

  actions: {
    createBucketType: function() {
      let isValid = this.validateBucketType();

      if (isValid) {
        let controller = this.controllerFor('bucket-type.create');
        let cluster = this.currentModel;
        let bucketType =  this.prepareBucketType();
        let self = this;

        this.explorer.createBucketType(cluster.get('name'), bucketType).then(
          function onSuccess(data) {
            self.transitionTo('bucket-type', cluster.get('name'), bucketType.name).then(function() {
              controller.clearState();
            });
          },

          function onFail(data) {
            self.render('alerts.error-request-was-not-processed', {
              into: 'application',
              outlet: 'alert'
            });
          }
        );
      }
    },

    cancelCreateBucketType: function() {
      let cluster = this.currentModel;
      let controller = this.controllerFor('bucket-type.create');

      this.transitionTo('cluster.data', cluster.get('name')).then(function() {
        controller.clearState();
      });
    }
  }
});
