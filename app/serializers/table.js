import ApplicationSerializer from './application';
import Ember from 'ember';
import _ from 'lodash/lodash';

export default ApplicationSerializer.extend({
  normalizeResponse: function(store, primaryModelClass, payload, id, requestType) {
    let sortBy = Ember.Enumerable.sortBy;

    // Parse the DDL object into specific properties and then delete the object
    payload.tables.forEach(function(table) {
      let ddl = table.props.ddl;

      // Assign table columns
      // *** Note: They are called 'fields' instead of 'columns' in the response. Docs use 'columns', so that is what we will use
      table.columns = [];
      Object.keys(ddl.fields).forEach(function(columnName) {
        table.columns.push(_.extend({name: columnName}, ddl.fields[columnName]));
      });

      // Assign partition key
      table.partition_key = [];
      ddl.partition_key.forEach(function(pk) {
        let isQuanta = pk.indexOf('quantum') > -1;

        // Reformat quantum to have spaces after commas
        if (isQuanta) {
          pk = pk.split(',').join(', ');
        }

        table.partition_key.push({
          name: pk,
          quantum: isQuanta
        });
      });

      // Assign local key
      table.local_key = ddl.local_key;

      delete table.props.ddl;
    });

    payload.tables = payload.tables.sortBy('name');

    return this._super(store, primaryModelClass, payload, id, requestType);
  }
});
