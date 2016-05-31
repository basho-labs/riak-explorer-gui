import DS from 'ember-data';
import CachedList from "../mixins/models/cached-list";

/**
 * Represents a list of rows in the current table,
 * cached by the Explorer API.
 *
 * @class RowsList
 * @extends CachedList
 * @uses Table
 */
var RowsList = DS.Model.extend(CachedList, {
  /**
   * The table that owns this rows list.
   * @property table
   * @type Table
   */
  table: DS.belongsTo('table')
});

export default RowsList;
