/**
 * @file Defines behaviours for an RSVP with your face component
 */

var Webcam = require('webcamjs'),
	device = require('../../js/device');

var RsvpForm = function (el) {
	this.el = el;
	this.cameraWrapper = this.el.querySelector('.rsvp_form_camera');
	this.cameraHint = this.el.querySelector('.rsvp_form_camera_hint');
	this.cameraImg = this.el.querySelector('.rsvp_form_camera_img');
	this.cameraResult = this.el.querySelector('.rsvp_form_camera_result');
	this.cameraInput = this.el.querySelector('.rsvp_form_camera_input');
	this.cameraShutter = this.el.querySelector('.rsvp_form_shutter');
	this.cameraReset = this.el.querySelector('.rsvp_form_reset');
	this.cameraData = this.el.querySelector('.rsvp_form_camera_data');

	this.hideShutter();
	this.hideReset();
	this.hideResult();

	this.cameraWrapper.addEventListener('click', this.requestCamera.bind(this));
	this.cameraShutter.addEventListener('click', this.snapPhoto.bind(this));
	this.cameraReset.addEventListener('click', this.resetPhoto.bind(this));

	if (device.platform !== 'ios') {
		// All platforms apart from iOS support in-page camera feed
		Webcam.on('live', function () {
			this.showShutter();
			this.hideHint();
		}.bind(this));
	}
};

RsvpForm.prototype = {

	showHint: function () {
		this.cameraHint.style.display = null;
	},

	hideHint: function () {
		this.cameraHint.style.display = 'none';
	},

	showShutter: function () {
		this.cameraShutter.style.display = null;
	},

	hideShutter: function () {
		this.cameraShutter.style.display = 'none';
	},

	showReset: function () {
		this.cameraReset.style.display = null;
	},

	hideReset: function () {
		this.cameraReset.style.display = 'none';
	},

	showResult: function () {
		this.cameraResult.style.display = null;
	},

	hideResult: function () {
		this.cameraResult.style.display = 'none';
	},

	requestCamera: function () {
		if (!this.attached) {
			Webcam.attach(this.cameraImg);
			this.attached = true;
		}
	},

	snapPhoto: function () {
		Webcam.snap( function(data_uri) {
			// Add image data to form
			this.cameraData.value = data_uri;
			// Show photo
			this.cameraResult.innerHTML = '<img src="'+data_uri+'"/>';
			this.cameraResult.style.display = null;
			// Show reset button
			this.showReset();
			this.cameraShutter.style.display = 'none';
		}.bind(this));
	},

	resetPhoto: function () {
		this.cameraResult.innerHTML = '';
		this.hideResult();
		// Hide reset button
		this.hideReset();
		this.showShutter();
	},

	setAttending: function (attending) {
		if (attending) {
			this.el.querySelector('#attending_yes').checked = true;
		} else {
			this.el.querySelector('#attending_no').checked = true;
		}
	}
};

module.exports = RsvpForm;