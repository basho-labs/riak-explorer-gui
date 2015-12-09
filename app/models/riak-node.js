import DS from 'ember-data';

var RiakNode = DS.Model.extend({
  /**
   * Whether or not the node is available when pinged.
   *
   * @property available
   * @type Boolean
   */
  available: DS.attr('boolean', { default: false })
});

export default RiakNode;
