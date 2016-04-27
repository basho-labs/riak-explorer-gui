import ApplicationSerializer from './application';
import Ember from 'ember';
import _ from 'lodash/lodash';

export default ApplicationSerializer.extend({
  normalizeResponse: function(store, primaryModelClass, payload, id, requestType) {
    let sortBy = Ember.Enumerable.sortBy;

    // Parse the DDL object into specific properties and then delete the object
    payload.tables.forEach(function(table) {
      let ddl = table.props.ddl;

      table.fields = ddl.fields;
      table.local_key = ddl.local_key;
      table.partition_key = ddl.partition_key;

      // Reformat quantum to have spaces after commas
      table.partition_key.forEach(function(item, index) {
        if (item.indexOf('quantum') > -1) {
          table.partition_key[index] = item.split(',').join(', ');
        }
      });

      delete table.props.ddl;
    });

    payload.tables = payload.tables.sortBy('name');

    return this._super(store, primaryModelClass, payload, id, requestType);
  }
});
