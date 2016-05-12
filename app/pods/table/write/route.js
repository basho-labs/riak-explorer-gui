import Ember from 'ember';
import LoadingSlider from '../../../mixins/routes/loading-slider';
import ScrollReset from '../../../mixins/routes/scroll-reset';
import WrapperState from '../../../mixins/routes/wrapper-state';
import _ from 'lodash/lodash';

export default Ember.Route.extend(LoadingSlider, ScrollReset, WrapperState, {
  model: function(params) {
    return this.explorer.getTable(params.clusterName, params.tableName);
  },

  afterModel: function(model, transition) {
    this.setSidebarCluster(model.get('cluster'));
    this.setBreadCrumbs({
      cluster: model.get('cluster'),
      table: model,
      crudAction: 'write to table'
    });
    this.setViewLabel({
      preLabel: 'Table',
      label: model.get('name')
    });
  },

  setupController: function(controller, model) {
    this._super(controller, model);

    controller.resetState();
  },

  prepareData: function(stringData) {
    let data;
    let transformed = `[${stringData.replace(/'/g, '"')}]`; // Wraps the comma separated strings in an array, and replaces any single quotes with double

    try { data = JSON.parse(transformed); } catch(e) {}

    return data;
  },

  validateData: function(data) {
    let isValid = false;

    if (data && _.isArray(data)) {
      let arrayLength = data.length;
      let subArrayCount = data.filter(function(item) { return _.isArray(item); }).length;
      isValid = (arrayLength === subArrayCount);
    }

    if (!isValid) {
      // TODO: Update
      this.controller.set('errors', 'Submitted Data is not valid. The textfield expects an array of arrays, each sub-array representing a row to be inserted. View the example for valid input.');
      this.scrollToTop();
    }

    return isValid;
  },

  actions: {
    writeDataToTable: function(table, data) {
      this.controller.clearErrors();
      this.controller.clearSuccessMessage();

      let sanitizedData = this.prepareData(data);
      let isValid = this.validateData(sanitizedData);
      let self = this;

      if (isValid)  {
        this.get('explorer').updateTable(table, sanitizedData).then(
          function onSuccess(data) {
            let tableName = table.get('name');

            self.controller.clearErrors();
            self.controller.clearWriteData();
            self.controller.set('successMessage', `Your data was saved to the ${tableName} table.`);
            self.scrollToTop();
          },
          function onFail(error) {
            self.controller.set('errors', 'The server failed to save the data to the table, check that your data is formatted correctly and try again.');
            self.scrollToTop();
          }
        );
      }

      return false;
    }
  }
});
