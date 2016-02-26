import DS from 'ember-data';

export default DS.Model.extend({
  /**
   * Node the config file belongs to.
   * @property node
   * @type DS.Model
   */
  node: DS.belongsTo('node'),

  /**
   * Contents of the config file so they can be displayed in the ui.
   *
   * @property content
   * @type String
   */
  content: DS.attr('string'),

  /**
   * The name of the file. The actual id is a composite id (i.e. cluster1/node1/file1.log).
   *
   * @property name
   * @type String
   */
  name: DS.attr('string')
});

