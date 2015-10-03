/**
 * @file Modal behaviours
 * @author Tom Jenkins tom@itsravenous.com
 */

var Modal = function (el) {
	this.el = el;
	this.contentEl = el.querySelector('.modal_content');

	// Add bindings
	this.el.addEventListener('click', this.hide.bind(this));
	this.contentEl.addEventListener('click', function (e) {
		e.stopPropagation();
	});
	document.onkeydown = function(evt) {
		evt = evt || window.event;
		if (evt.keyCode == 27 && this.shown) {
			this.hide();
		}
	}.bind(this);
};

Modal.prototype = {
	
	show: function () {
		this.shown = true;
		this.el.classList.add('is_active');
	},

	hide: function () {
		this.shown = false;
		this.el.classList.remove('is_active');
	},

	setContentEl: function (el) {
		// Remove current child, if any
		if (this.contentEl.children.length) {
			this.contentEl.removeChild(this.contentEl.children[0]);
		}
		this.contentEl.appendChild(el);
	}

};

// Export singleton
var modalEl = document.querySelector('.modal');
if (modalEl) {
	module.exports = new Modal(modalEl);
}