import ApplicationSerializer from './application';
import Ember from 'ember';
import _ from 'lodash/lodash';

export default ApplicationSerializer.extend({
  normalizeResponse: function(store, primaryModelClass, payload, id, requestType) {
    let sortBy = Ember.Enumerable.sortBy;

    // Parse the DDL object into specific properties and then delete the object
    payload.tables.forEach(function(table) {
      let ddl = table.props.ddl;

      // Assign table fields
      table.fields = [];
      Object.keys(ddl.fields).forEach(function(fieldName) {
        table.fields.push(_.extend({name: fieldName}, ddl.fields[fieldName]));
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
