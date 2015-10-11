/**
 * @file Device detection
 * @author Tom Jenkins tom@itsravenous.com
 */
if (window.device) {
	var dev = window.device;
} else {
	var platform;
	var uaString = navigator.userAgent.toLowerCase();

	var iOS = ( uaString.match(/(ipad|iphone|ipod)/g) ? true : false );
	var androidIdx = uaString.indexOf('android');
	var android = androidIdx > -1;

	var platform = android ? 'Android' : iOS ? 'iOS' : 'default';
	
	var dev = {
		platform: platform
	};

	if (platform == 'Android') {
		dev.androidVersion = parseFloat(uaString.slice(androidIdx+8)); 
	}
}

// Add platform class to body for styling hooks
document.body.className += ' ' + platform.toLowerCase();
if (dev.androidVersion) {
	document.body.className += ' android-' + dev.androidVersion.toString().replace('.', '-');
}

module.exports = dev;