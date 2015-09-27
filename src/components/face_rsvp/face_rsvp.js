/**
 * @file Defines behaviours for a RSVP with your face component
 */

var Webcam = require('webcamjs');

var FaceRsvp = function (el) {
	this.el = el;
	this.camera = this.el.querySelector('.face_rsvp_camera');
	this.result = this.el.querySelector('.face_rsvp_result');
	this.shutter = this.el.querySelector('.face_rsvp_shutter');
	this.reset = this.el.querySelector('.face_rsvp_reset');

	this.reset.style.display = 'none';


	Webcam.attach(this.camera);
	this.shutter.addEventListener('click', this.snapPhoto.bind(this));
	this.reset.addEventListener('click', this.resetPhoto.bind(this));
};

FaceRsvp.prototype = {
	snapPhoto: function () {
		Webcam.snap( function(data_uri) {
			// Show photo
			this.result.innerHTML = '<img src="'+data_uri+'"/>';
			// Show reset button
			this.reset.style.display = null;
			this.shutter.style.display = 'none';
		}.bind(this));
	},

	resetPhoto: function () {
		this.result.innerHTML = '';
		// Hide reset button
		this.reset.style.display = 'none';
		this.shutter.style.display = null;
	}
};

new FaceRsvp(document.querySelector('.face_rsvp'));