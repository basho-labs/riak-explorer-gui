import Ember from 'ember';

/**
 * A pagination UI component. Determines how many links to show, handling click actions on those links,
 * sending data "up" to be acted upon, and updating selected state.
 *
 * @class pagination-component
 * @extends Ember.Component
 */
export default Ember.Component.extend({
  /**
   * Sets the class name of the component
   *
   * @property classNames
   * @type Array
   */
  classNames: ['pagination-component-container'],

  /**
   * Stores the number of pagination links the UI could potentially display
   *
   * @property numberLinksCount
   * @type Integer
   * @default 0
   */
  numberLinksCount: 0,

  /**
   * Stores the current page or chunk that the UI is displaying
   *
   * @property currentChunk
   * @type Integer
   * @default 1
   */
  currentChunk: 1,

  /**
   * Stores the current page or chunk size
   *
   * @property chunkSize
   * @type Integer
   * @default 0
   */
  chunkSize: 0,

  /**
   * An array of sequential integers starting at 1. i.e. [1,2,3,4,5,6]
   * This is used to create the links in the UI as handlebars does not have a "times" helper by default
   *
   * @property numberLinks
   * @type Array
   * @default []
   */
  numberLinks: [],

  /**
   * Stores the total length of the items on which are being paginated
   *
   * @property totalSize
   * @type Integer
   * @default 0
   */
  totalSize: 0,

  didReceiveAttrs: function() {
    this.setNumberLinksCount();
    this.setNumberLinks();
  },

  /**
   * Lifecycle method. This is called every time new data is fed into the component.
   * Current chunk is set on various actions, data is fetched as a result of that action, the component receives new data,
   * and this method is invoked.
   *
   * @method didRender
   */
  didRender: function() {
    this.updateSelectedClass();
  },

  /**
   * Figures out what the item range for a given chunk based on the chunk size.
   * If current chunk is 1 and paginating every ten items, the object returns the range 0-9
   * If current chunk is 3 and paginating every ten items, the object returns the range 30-39
   *
   * @method calculateRequestedRange
   * @private
   * @param chunk {String}
   * @return {Object} Contains low and high properties. i.e. { low: 31, high: 40 }
   */
  calculateRequestedRange: function(chunk) {
    let chunkSize = this.get('chunkSize');

    return {
      lowIndex: (chunk * chunkSize - chunkSize),
      highIndex: (chunk * chunkSize) -1
    };
  },

  /**
   * Determines the total number of links needed to be created given the total length and chunk size.
   *
   * @method setNumberLinksCount
   * @private
   * @return {Integer}
   */
  setNumberLinksCount: function() {
    let linkCount = Math.ceil(this.get('totalSize') / this.get('chunkSize'));

    return this.set('numberLinksCount', linkCount);
  },

  setNumberLinks: function() {
    // reset numberLinks array
    this.set('numberLinks', []);

    // We want the loop to be 1 indexed, not 0
    for (var i = 1; i < this.get('numberLinksCount') + 1; i++) {
      this.numberLinks.push(i);
    }
  },

  /**
   * Sets the selected class on the current pagination link item in the DOM. Using jQuery to mutate state is not ideal,
   * but since this state is contained within the component, and because we don't have conditional logic in handlebars,
   * this is the cleanest way to handle this.
   *
   * @method updateSelectedClass
   * @private
   */
  updateSelectedClass: function() {
    let self = this;
    let numberLinks = this.$().find('.pagination-link.number-link');

    // Remove the selected class
    numberLinks.removeClass('selected');

    // Add selected to the correct link
    numberLinks.filter(function(index) {
      let oneBasedIndex = index + 1;

      return oneBasedIndex === self.get('currentChunk');
    }).addClass('selected');
  },

  /**
   * Determines whether or not the UI should show pagination links. This is used by the handlebars templates.
   * returns false if there is only one page and pagination is not needed.
   *
   * @method shouldShowPaginationLinks
   * @return {Boolean}
   */
  shouldShowPaginationLinks: function() {
    return this.get('numberLinksCount') > 1;
  }.property('numberLinksCount'),

  /**
   * Determines whether or not the previous button should disabled. This is used by the handlebars templates.
   * Returns true if the current page is 1, because there is not previous page at that point.
   *
   * @method shouldPrevBeDisabled
   * @return {Boolean}
   */
  shouldPrevBeDisabled: function() {
    return this.get('currentChunk') <= 1;
  }.property('currentChunk'),

  /**
   * Determines whether or not the next button should disabled. This is used by the handlebars templates.
   * Returns true if the current page is the last item in the list, because there is not previous page at that point.
   *
   * @method shouldNextBeDisabled
   * @return {Boolean}
   */
  shouldNextBeDisabled: function() {
    return this.numberLinks.length === this.get('currentChunk');
  }.property('currentChunk'),

  /**
   * All actions that the pagination component handles. Upon receiving an action, it updates the state of the component
   * and sends the event "up" for higher level work that it is not aware of.
   *
   * @property actions
   * @type Object
   */
  actions: {
    numberLinkClick: function(link) {
      let chunk = link;
      let requestedRange = this.calculateRequestedRange(chunk);

      this.set('currentChunk', chunk);
      this.sendAction('sectionRequest', requestedRange.lowIndex, requestedRange.highIndex);
    },

    prevLinkClick: function() {
      if (!this.get('shouldPrevBeDisabled')) {
        let currentChunk = this.get('currentChunk');
        let newChunk = currentChunk - 1;
        let requestedRange = this.calculateRequestedRange(newChunk);

        this.set('currentChunk', newChunk);
        this.sendAction('sectionRequest', requestedRange.lowIndex, requestedRange.highIndex);
      }
    },

    nextLinkClick: function() {
      if (!this.get('shouldNextBeDisabled')) {
        let currentChunk = this.get('currentChunk');
        let newChunk = currentChunk + 1;
        let requestedRange = this.calculateRequestedRange(newChunk);

        this.set('currentChunk', newChunk);
        this.sendAction('sectionRequest', requestedRange.lowIndex, requestedRange.highIndex);
      }
    }
  }
});
