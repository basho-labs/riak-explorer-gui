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

    this.setExample();
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

  runValidations: function(data) {
    return this.validateWriteCoversAllColumns(data) &&
      this.validateWriteUsesCorrectDataTypes(data);
  },

  setExample: function() {
    // HERE BE DRAGONS: I apologize for the extremely complicated code, the point of this function is to dynamically
    //  generate 3 sample writes for the user. We have to create a giant string that looks a group of arrays, and type
    //  conversion in js in not ideal. All complicated parts are commented to help clarify

    // Eventual string that will be inserted into the code editor
    let exampleWrite = '';

    // Each column type with ten possibilies, 3 times. This ensures no matter what how many columns, we can use modulo 10
    // and generate a relatively unique array input for the given example
    let exampleTypeMatrix = {
      boolean: [
        [true, false, true, false, true, false, true, false, true, false],
        [true, false, true, false, true, false, true, false, true, false],
        [true, false, true, false, true, false, true, false, true, false]
      ],
      double: [
        [10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9, 10.0],
        [20.1, 20.2, 20.3, 20.4, 20.5, 20.6, 20.7, 20.8, 20.9, 20.0],
        [30.1, 30.2, 30.3, 30.4, 30.5, 30.6, 30.7, 30.8, 30.9, 30.0]
      ],
      sint64: [
        [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        [20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
        [30, 31, 32, 33, 34, 35, 36, 37, 38, 39]
      ],
      timestamp: [
        [1464024810, 1464024811, 1464024812, 1464024813, 1464024814, 1464024815, 1464024816, 1464024817, 1464024818, 1464024819],
        [1464024820, 1464024821, 1464024822, 1464024823, 1464024824, 1464024825, 1464024826, 1464024827, 1464024828, 1464024829],
        [1464024830, 1464024831, 1464024832, 1464024833, 1464024834, 1464024835, 1464024836, 1464024837, 1464024838, 1464024839]
      ],
      varchar: [
        [`'foo'`, `'bar'`, `'Lorem'`, `'ipsum'`, `'dolor'`, `'sit'`, `'amet'`, `'consectetur'`, `'adipiscing'`, `'elit'`],
        [`'Aliquam'`, `'sit'`, `'amet'`, `'tincidunt'`, `'felis'`, `'Curabitur'`, `'at;`, `'gravida'`, `'est'`, `'Quisque'`],
        [`'vehicula'`, `'mi'`, `'sed'`, `'libero'`, `'hendrerit'`, `'vel'`, `'mollis'`, `'lorem'`, `'euismod'`, `'Donec'`]
      ]
    };
    let columns = this.currentModel.get('columns');

    // Creates three sample writes by going through each column and using a sample of that columns type
    _.times(3, function(timesIndex) {
      let example = [];

      columns.forEach(function(column, columnIndex) {
        example.push(exampleTypeMatrix[column.type][timesIndex][columnIndex % 10]);
      });

      // convert example array to string, gives us the desired formatting and spacing
      example = example.join(', ');

      if (timesIndex === 0) {
        exampleWrite = `[${example}]`;
      } else {
        exampleWrite += `, [${example}]`;
      }
    });

    this.controller.set('example', exampleWrite);
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
