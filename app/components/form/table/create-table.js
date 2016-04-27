import Ember from 'ember';
import ScrollReset from '../../../mixins/component/scroll-reset';

export default Ember.Component.extend(ScrollReset, {
  tagName: 'form',

  explorer: Ember.inject.service(),

  table: null,

  name: '',

  errors: [],

  hasMultipleTimestampFields: false,

  family: { name: '', type: 'varchar' },

  series: { name: '', type: 'varchar' },

  fields: [{ name: '', type: 'varchar' }],

  quantum: {
    fieldName: '',
    quantity: null,
    unit: 'days'
  },

  fieldTypes: ['varchar', 'boolean', 'timestamp', 'sint64', 'double'],

  timeUnits: ['days', 'hours', 'minutes', 'seconds'],

  clearErrors: function() {
    return this.set('errors', []);
  },

  // returns an object with all the table data
  collectTableData: function() {
    let tableData = {};

    tableData.name = this.get('name');
    tableData.family = this.get('family');
    tableData.series = this.get('series');
    tableData.fields = this.get('fields');
    tableData.quantum = this.get('quantum');

    return tableData;
  },

  prepareTableData: function() {
    let table = this.collectTableData();
    let quantumUnitValueAbbr = table.quantum.unit.split('')[0]; // The first letter of the quantum unit value
    let fieldsString = '';

    // Dynamically construct the fieldString
    table.fields.forEach(function(field, index) {
      return fieldsString = fieldsString + `${field.name} ${field.type} not null, `;
    });

    let tableDefinition = `CREATE TABLE ${table.name} ` +
       `(${table.family.name} ${table.family.type} not null, ` +
       `${table.series.name} ${table.series.type} not null, ` +
       `${fieldsString}` +
       `PRIMARY KEY ((${table.family.name}, ${table.series.name}, quantum(${table.quantum.fieldName}, ${table.quantum.quantity}, '${quantumUnitValueAbbr}')), ` +
        `${table.family.name}, ${table.series.name}, ${table.quantum.fieldName}))`;

    return {
      name: table.name,
      data: {
        props: {
          table_def: tableDefinition
        }
      }
    };
  },

  validateNotDupe: function() {
    let name = this.get('name');
    let existingTables = this.get('cluster').get('tables').mapBy('name');
    let notDupe = (existingTables.indexOf(name) === -1);

    if (!notDupe) {
      this.get('errors').pushObject(`A table named "${name}" already exists on this cluster. Please give this table a unique name.`);
    }

    return notDupe;
  },

  // Name can not have whitespace
  validateName: function() {
    let name = this.get('name');
    let isValid = name.length && name.indexOf(' ') === -1;

    if (!isValid) {
      this.get('errors').pushObject('Table name must be present and can not have whitespace');
    }

    return isValid;
  },

  validateFamily: function() {
    let family = this.get('family');
    let isValid = Ember.isPresent(family.name);

    if (!isValid) {
      this.get('errors').pushObject('Table requires a family name');
    }

    return isValid;
  },

  validateSeries: function() {
    let series = this.get('series');
    let isValid = Ember.isPresent(series.name);

    if (!isValid) {
      this.get('errors').pushObject('Table requires a series name');
    }

    return isValid;
  },

  validateFields: function() {
    let fields = this.get('fields');
    let isValid = !!(fields.filter(function(field) { return field.type === 'timestamp'; }).length);

    if (!isValid) {
      this.get('errors').pushObject('You must have at least one field that is a timestamp value.');
    }

    return isValid;
  },

  validateQuantum: function() {
    let quantum = this.get('quantum');
    let isPresent = Ember.isPresent(quantum.quantity);

    if (!isPresent) {
      this.get('errors').pushObject('Quantum must have a quantity value assigned to it.');
    }

    let timeFields = this.get('fields').filter(function(field) { return field.type === 'timestamp'; });
    let hasMatchingTimeField = timeFields.filter(function(field) { return quantum.fieldName === field.name; }).length;

    if (!hasMatchingTimeField) {
      this.get('errors').pushObject('Quantum must have a table field name that matches one a field name with a "timestamp" type.');
    }

    let isValid = isPresent && hasMatchingTimeField;

    return isValid;
  },

  validateTable: function() {
    let notDupe = this.validateNotDupe();
    let hasValidName = this.validateName();
    let hasValidFamily = this.validateFamily();
    let hasValidSeries = this.validateSeries();
    let hasValidFields = this.validateFields();
    let hasValidQuantum = this.validateQuantum();

    return (notDupe && hasValidName && hasValidFamily && hasValidSeries && hasValidFields && hasValidQuantum);
  },

  submit() {
    this.clearErrors();
    let isValid = this.validateTable();
    let self = this;

    if (isValid) {
      let clusterName = this.get('cluster').get('name');
      let data = this.prepareTableData();

      this.get('explorer').createBucketType(clusterName, data).then(
        function onSuccess() {
          return self.sendAction('tableCreated', self.get('name'));
        },
        function onFail(error) {
          self.scrollToTop();
          self.get('errors').pushObject('Sorry, something went wrong. Table was not created');
          return false;
        });
    } else {
      this.scrollToTop();
      return false;
    }
  },

  actions: {
    addNewField: function() {
      this.get('fields').pushObject({ name: '', type: 'varchar' });
    },

    removeField: function(index) {
      this.get('fields').removeAt(index);
    }
  }
});
