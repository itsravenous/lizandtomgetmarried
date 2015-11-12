/**
 * @file Defines behaviours for an RSVP with your face component
 */

var Webcam = require('webcamjs'),
	device = require('../../js/device'),
	request = require('browser-request');

var RsvpForm = function (el) {
	this.el = el;
	this.form = this.el.getElementsByTagName('form')[0];
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

	if (device.platform === 'iOS') {
		// Use file input for camera capture
		var readImage = function () {
			if (this.cameraInput.files && this.cameraInput.files[0]) {
				var fileReader = new FileReader();
				fileReader.onload = function(e) {
					// Dump to hidden input
					this.cameraData.value = e.target.result;
					// Show preview
					this.cameraResult.innerHTML = '<img src="'+e.target.result+'"/>';
					this.cameraResult.style.display = null;
				}.bind(this);
				fileReader.readAsDataURL(this.cameraInput.files[0]);
				this.cameraWrapper.style.display = null;
			}
		}.bind(this);

		// Get image data and display preview on photo selection
		this.cameraInput.addEventListener("change", readImage, false);
		// Hide camera result initially
		this.cameraWrapper.style.display = 'none';
	} else {
		// All platforms apart from iOS support in-page camera feed
		Webcam.on('live', function () {
			this.showShutter();
			this.hideHint();
		}.bind(this));
	}

	// Bind form submit
	this.form.addEventListener('submit', this.handleSubmit.bind(this));
};

RsvpForm.prototype = {

	handleSubmit: function (e) {
		// Build request body
		var body = [];
		var fields = this.form.querySelectorAll('input, select, textarea, button[type="submit"]');
		for (var i = 0; i < fields.length; i++) {
			body.push(fields[i].name+'='+fields[i].value);
		}

		// Send it
		request.post({
			url: this.form.action,
			body: body.join('&'),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}, this.handleResponse.bind(this));

		// Stop browser submitting form
		e.preventDefault();
	},

	handleResponse: function (err, response, body) {
		if (err) {
			console.error(err);
		} else {
			console.log(body);
		}
	},

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
