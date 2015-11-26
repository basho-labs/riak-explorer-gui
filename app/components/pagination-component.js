import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['pagination-component-container'],

  numberLinksCount: 0,

  currentChunk: 1,

  chunkSize: 10,

  numberLinks: [],

  actions: {
    numberLinkClick: function(link) {
      let chunk = link;
      let requestedRange = this._calculateRequestedRange(chunk);

      this.set('currentChunk', chunk);
      this.sendAction('section-request', requestedRange.low);
    },

    prevLinkClick: function() {
      if (!this.get('shouldPrevBeHidden')) {
        let currentChunk = this.get('currentChunk');
        let newChunk = currentChunk - 1;

        this.set('currentChunk', newChunk);
        this.sendAction('section-request', newChunk);
      }
    },

    nextLinkClick: function() {
      if (!this.get('shouldNextBeHidden')) {
        let currentChunk = this.get('currentChunk');
        let newChunk = currentChunk + 1;

        this.set('currentChunk', newChunk);
        this.sendAction('section-request', newChunk);
      }
    }
  },

  init: function() {
    this._super();
    this._createPaginationLinks();
  },

  _calculateRequestedRange: function(chunk) {
    let chunkSize = this.get('chunk-length');

    return {
      low:  (chunk * chunkSize - chunkSize) + 1,
      high: (chunk * chunkSize)
    };
  },

  _calculateNumberLinksCount: function() {
    let linkCount = Math.ceil(this.get('total-length')/this.get('chunk-length'));

    return this.set('numberLinksCount', linkCount);
  },

  _createPaginationLinks: function() {
    this._calculateNumberLinksCount();

    if (this.get('shouldShowPaginationLinks')) {
      // We want the loop to be 1 indexed, not 0
      for(var i=1; i < this.get('numberLinksCount')+1; i++) {
        this.numberLinks.push(i);
      }
    }
  },

  _updateSelectedClass: function() {
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

  shouldShowPaginationLinks: function() {
    // Do not create a pagination link if only one page
    return this.get('numberLinksCount') > 1;
  }.property('numberLinksCount'),

  shouldPrevBeHidden: function() {
    return this.get('currentChunk') <= 1;
  }.property('currentChunk'),

  shouldNextBeHidden: function() {
    return this.numberLinks.length === this.get('currentChunk');
  }.property('currentChunk'),

  didRender: function() {
    this._updateSelectedClass();
  }
});
