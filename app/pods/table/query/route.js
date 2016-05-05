import Ember from 'ember';
import LoadingSlider from '../../../mixins/routes/loading-slider';
import ScrollReset from '../../../mixins/routes/scroll-reset';
import WrapperState from '../../../mixins/routes/wrapper-state';

export default Ember.Route.extend(LoadingSlider, ScrollReset, WrapperState, {
  model: function(params) {
    return this.explorer.getTable(params.clusterName, params.tableName);
  },

  afterModel: function(model, transition) {
    this.setSidebarCluster(model.get('cluster'));
    this.setBreadCrumbs({
      cluster: model.get('cluster'),
      table: model
    });
    this.setViewLabel({
      preLabel: 'Table',
      label: model.get('name')
    });
  },

  setupController: function(controller, model) {
    this._super(controller, model);

    this.setExampleMessageIfPossible();
    controller.resetState();
  },

  setExampleMessageIfPossible: function() {
    let table = this.currentModel;

    if (table.get('hasQuantum')) {
      let controller = this.controller;
      let tableName = table.get('name');
      let partitionKey = table.get('partitionKey');
      let quantumName = table.get('quantumFieldName');
      let sampleNames = [
        "Lorem",
        "ipsum",
        "dolor",
        "sit",
        "amet",
        "consectetur",
        "adipiscing",
        "elit",
        "Aliquam",
        "sit",
        "amet",
        "tincidunt",
        "felis",
        "Curabitur",
        "at",
        "gravida",
        "est",
        "Quisque",
        "vehicula",
        "mi",
        "sed",
        "libero",
        "hendrerit",
        "vel",
        "mollis",
        "lorem",
        "euismod",
        "Donec",
        "fringilla",
        "iaculis",
        "sem",
        "vitae",
        "tincidunt",
        "lacus",
        "consectetur",
        "vitae",
        "Aliquam",
        "felis",
        "magna",
        "pellentesque",
        "vitae",
        "felis"
      ];
      let example = '';

      // Set Query Base
      example = `select * from ${tableName} where ${quantumName} > 1 and ${quantumName} < 9999`;

      // Add a comparison for each partition key field that isn't the quantum field
      partitionKey
        .filter(function(field) { return !field.quantum; })
        .mapBy('name')
        .forEach(function(fieldName, index) {
          example += ` and ${fieldName} = '${sampleNames[index]}'`;
        });

      controller.set('example', example);
    }
  },

  actions: {
    runQuery: function(table, query) {
      let controller = this.controller;

      // Set intermediate state
      controller.set('isLoading', true);

      // Execute Query
      this.explorer.queryTable(table, query).then(
        function onSuccess(data) {
          if (Ember.isEmpty(data.query.rows)) {
            controller.set('resultLength', null);
            controller.set('result', `No rows found on ${table.get('name')} given the statement: \n\n${query}`);
          } else {
            let stringifiedData = JSON.stringify(data.query.rows);
            let formattedStringForEditor;

            // Adds a line break after each array item
            // Removes the array surrounding all the results
            // Adds a space after each comma in the array for better legibility
            formattedStringForEditor = stringifiedData.replace(/],/g, '],\n');
            formattedStringForEditor = formattedStringForEditor.substring(1, formattedStringForEditor.length-1);
            formattedStringForEditor = formattedStringForEditor.replace(/,/g, ', ');

            controller.set('resultLength', data.query.rows.length);
            controller.set('result', formattedStringForEditor);
          }
        }, function onFail(error) {
          controller.set('result', `${error.status} ${error.statusText} trying to execute statement: \n\n${query}`);
        }
      );

      return false;
    }
  }
});
