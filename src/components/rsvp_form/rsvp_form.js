/**
 * @file Defines behaviours for an RSVP with your face component
 */

var Webcam = require('webcamjs'),
	device = require('../../js/device'),
	request = require('browser-request');

var RsvpForm = function (el) {
	this.el = el;
	this.form = this.el.getElementsByTagName('form')[0];
	this.submitButton = this.form.querySelector('button[type="submit"]');
	this.statusArea = this.el.querySelector('.rsvp_form_status');
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

		Webcam.on('error', function (e) {
			alert('There seems to be a problem accessing your webcam - please refresh and select "Allow" when asked.');
		});
	}

	// Listen for portrait/landscape change to sort webcam aspect ratio on Android
	if (device.platform === 'Android') {
		window.addEventListener('orientationchange', function () {
			if (this.attached && this.el.style.display !== 'none') {
				this.attached = false;
				this.requestCamera(null, true);
			}
		}.bind(this));
	}

	this.sizeCamera();

	// Bind form submit
	this.form.addEventListener('submit', this.handleSubmit.bind(this));
};

RsvpForm.prototype = {

	handleSubmit: function (e) {
		this.form.classList.add('submitting');
		this.submitButton.innerHTML = 'Sending...';
		// Build request body
		var body = [];
		var fields = this.form.querySelectorAll('input, select, textarea, button[type="submit"]');
		for (var i = 0; i < fields.length; i++) {
			if ((fields[i].type === 'radio' || fields[i].type === 'checkbox') && !fields[i].checked) continue;
			body.push(fields[i].name+'='+encodeURIComponent(fields[i].value));
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
		this.form.classList.remove('submitting');
		if (err) {
			this.submitButton.innerHTML = 'Send!';
			console.error('error', err);
		} else {
			this.form.classList.add('submitted');
			if (response.statusCode !== 200) {
				this.submitButton.innerHTML = 'Send!';
				this.form.classList.add('error');
				this.statusArea.innerHTML = body;
			} else {
				this.submitButton.disabled = true;
				this.submitButton.innerHTML = 'Sent!';
				this.form.innerHTML = body;
			}
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

	showImg: function () {
		this.cameraImg.style.display = null;
	},

	hideImg: function () {
		this.cameraImg.style.display = 'none';
	},

	requestCamera: function (e, fromOrientationChange) {
		if (!this.attached) {
			// Set portrait aspect for mobile cams
			setTimeout(function () {
				this.sizeCamera(fromOrientationChange);
				Webcam.attach(this.cameraImg);
				this.attached = true;
			}.bind(this), 100);
		}
	},

	sizeCamera: function (fromOrientationChange) {
		if (device.platform === 'Android') {
			var portrait = window.innerWidth < window.innerHeight;
			if (fromOrientationChange) portrait = !portrait;
			var cw = portrait ? 240 : 320;
			var ch = portrait ? 320 : 240;
			Webcam.reset();
			Webcam.set({
				width: cw,
				height: ch,
				dest_width: cw,
				dest_height: ch
			});
			this.cameraWrapper.style.width = cw+'px';
			this.cameraWrapper.style.height = ch+'px';
			this.cameraResult.style.width = cw+'px';
			this.cameraResult.style.height = ch+'px';
			Webcam.on('live', function () {
				var vid = this.cameraWrapper.querySelector('video');
				vid.style.width = cw+'px';
				vid.style.height = ch+'px';
				vid.style.transform = null;
				Webcam.off('live');
			}.bind(this));
		}
	},

	snapPhoto: function () {
		Webcam.snap( function(data_uri) {
			// Add image data to form
			this.cameraData.value = data_uri;
			// Show photo
			this.cameraResult.innerHTML = '<img src="'+data_uri+'"/>';
			this.showResult();
			this.hideImg();
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
		this.showImg();
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
