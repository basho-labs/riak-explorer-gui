import Ember from 'ember';
import LoadingSlider from '../../../mixins/routes/loading-slider';
import ScrollReset from '../../../mixins/routes/scroll-reset';
import WrapperState from '../../../mixins/routes/wrapper-state';
import { isInteger, isNumber } from '../../../utils/data-type-checks';
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
    let isValid = false;
    let data = null;

    // Wraps the comma separated strings in an array, and replaces any single quotes with double
    let transformed = `[${stringData.replace(/'/g, '"')}]`;

    // Convert to actual JSON
    try {
      data = JSON.parse(transformed);
    } catch(e) {
      isValid = false;
    }

    // Make sure all child items inside the parent array are arrays
    if (data) {
      isValid = (data.length === data.filter(function(item) { return _.isArray(item); }).length);
    }

    if (!isValid) {
      this.controller.set('errors', [
        'Submitted Data is not formatted correctly.',
        'The editor expects an array for each row you wish to insert, with each array separated by a comma.'
      ]);
      this.scrollToTop();
    }

    return data;
  },

  validateWriteCoversAllColumns: function(data) {
    let columnsInTable = this.currentModel.get('columns').length;

    // Checks that each arrays length matches the amount of columns defined in the table
    let isValid = (data.length === data.filter(function(subArray) { return subArray.length === columnsInTable; }).length);

    if (!isValid) {
      // 'Row column values must be in the same order as defined in the table. Refer to the table columns in the table reference for order.'
      this.controller.set('errors', [
        `Submitted Data is not correct. At least one of your arrays length does not match the amount of columns in the table.`,
        `Row values must be in the same order as columns are defined on the table. Refer to the table definition for correct order.`,
        `If a table column is optional, and you do not wish to pass a value, use <code>null</code> as the row array value.`
      ]);
      this.scrollToTop();
    }

    return isValid;
  },

  validateWriteUsesCorrectDataTypes: function(data) {
    let tableColumns = this.currentModel.get('columns');
    let controller = this.controller;
    let self = this;

    let isValid = (data.length === data.filter(function(subArray) {
      return tableColumns.length === subArray.filter(function(item, index) {
          let column = tableColumns[index];
          let isSameType;

          if (column.optional && item === null) {
            isSameType = true;
          } else {
            switch(column.type) {
              case 'varchar':
                isSameType = _.isString(item);
                break;
              case 'boolean':
                isSameType = _.isBoolean(item);
                break;
              case 'timestamp':
                isSameType = isInteger(item) && item > 0;
                break;
              case 'sint64':
                isSameType = isInteger(item);
                break;
              case 'double':
                // Would like to use isFloat, but valid values like 4.0 do not succeed. JS will automatically convert to 4
                // There are hacks around it, but since we are using JSON.parse/stringifiy, there is too much effort involved
                isSameType = isNumber(item);
                break;
              default:
                isSameType = false;
                break;
            }
          }

          if (!isSameType) {
            let errors = controller.get('errors');

            if (!errors.length) { errors.pushObject('Submitted Data is not correct. Incorrect data types submitted:'); }

            errors.pushObject(`The ${column.name} column expects a type of ${column.type}, but instead was passed ${item}`);
            self.scrollToTop();
          }

          return isSameType;
        }).length;
    }).length);

    return isValid;
  },

  runValidations: function(data) {
    return this.validateWriteCoversAllColumns(data) &&
           this.validateWriteUsesCorrectDataTypes(data);
  },

  actions: {
    writeDataToTable: function(table, data) {
      this.controller.clearErrors();
      this.controller.clearSuccessMessage();

      let sanitizedData = this.prepareData(data);
      let isValid = sanitizedData ? this.runValidations(sanitizedData) : false;
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
