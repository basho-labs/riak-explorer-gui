import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'table',

    classNames: ['key-value-table', 'ts-table-reference'],

    table: null
});
