export default Ember.Component.extend({
  tagName: 'span',
  classNames: 'date-of-birth-tip',

  didInsertElement() {
    Ember.$(document).on('click', Ember.run.bind(this, this.documentClick));
  },

  willDestroyElement() {
    Ember.$(document).off('click', Ember.run.bind(this, this.documentClick));
  },

  documentClick(e) {
    let $element = this.$();
    let $target = $(e.target);
    if ($target.closest($element).length < 1 &&
        this._state !== 'destroying') {
      this.set('showTip', false);
    }
  },

  mouseEnter() {
    this.set('showTip', true);
  },

  mouseLeave() {
    this.set('showTip', false);
  },

  actions: {
    toggleTip() {
      this.toggleProperty('showTip');
    }
  }
})
