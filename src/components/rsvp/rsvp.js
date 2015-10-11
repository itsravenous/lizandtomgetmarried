/**
 * @file Defines behaviours for a RSVP component
 */

var RsvpForm = require('../rsvp_form/rsvp_form');
var modal = require('../modal/modal');

var RSVP = function (el) {
	this.el = el;

	// Get important elements
	this.yes = el.querySelector('.rsvp_yes');
	this.no = el.querySelector('.rsvp_no');

	// Add bindings
	this.yes.addEventListener('click', this.showForm.bind(this));
	this.no.addEventListener('click', this.showForm.bind(this));

	// Create RSVP component
	this.form = new RsvpForm(el.querySelector('.rsvp_form'));

	// Hide form by default
	this.hideForm();
};

RSVP.prototype = {

	/**
	 * Shows the RSVP form 
	 */
	showForm: function (e) {
		if (e) e.preventDefault();
		modal.setContentEl(this.form.el);
		this.form.el.style.display = null;
		setTimeout(modal.show.bind(modal), 10);
	},

	/**
	 * Hides the RSVP form
	 */
	hideForm: function () {
		this.form.el.style.display = 'none';
	}

};

new RSVP(document.querySelector('.rsvp'));

module.exports = RSVP;