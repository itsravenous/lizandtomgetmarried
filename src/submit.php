<?php

	error_reporting(1);

	require_once(__DIR__.'/config.php');

	class RequestHandler {
		public static function handle() {
			// Ensure rsvp storage dir exists and is writable
			self::ensureRsvpDir();

			// Check for for submission
			if (isset($_POST['submit'])) {
				// Validate data
				self::validate($_POST);
				// Sanitise it
				$data = self::sanitise($_POST);

				// Persist RSVP
				$rsvp = new Rsvp($data);
				$saved = $rsvp->save();
				// Send it
				if (defined('EMAIL_DESTINATION')) {
					$sent = self::sendRsvp($rsvp);
				}

				$extra = $_POST['attending'] === 'yes' ? 'we\'re looking forward to seeing you at the wedding!' : 'sorry you can\'t make it.';

				// Send response
				if ($saved && $sent) {
					self::confirm('Thanks for RSVPing - ' . $extra);
				} elseif ($saved) {
					self::confirm('Thanks for RSVPing - ' . $extra);
				} else {
					throw new Exception(sprintf('Something went wrong in saving the RSVP. Please try again later or email %s', EMAIL_DESTINATION));
				}
			}
		}

		private static function sanitise($data) {
			$data['names'] = substr(preg_replace('/[^a-z0-9\.]/', '', strtolower($data['names'])), 0, 64);
			return $data;
		}

		private static function validate($data) {
			// Validate data
			if (empty($data['names'])) {
				self::reject('Please enter your name(s)');
			}
		}

		private static function reject($reason) {
			http_response_code(400);
			die($reason);
		}

		private static function confirm($message) {
			http_response_code(200);
			die($message);
		}

		private static function sendRsvp($rsvp) {
			$headers  = 'MIME-Version: 1.0' . "\r\n";
			$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
			return mail(EMAIL_DESTINATION, 'Wedding Rsvp', $rsvp->toHtml(), $headers);
		}

		private static function ensureRsvpDir() {
			if (!file_exists(FILE_DESTINATION)) {
				if (!mkdir(FILE_DESTINATION, 0777, true)) {
					throw new Exception('Could not create RSVP storage folder');
				} elseif (!is_writable(FILE_DESTINATION)) {
					throw new Exception('RSVP storage folder not writable');
				} else {
					return true;
				}
			}
		}
	}

	class Rsvp {
		public $names;
		public $attending;
		public $song;
		public $extra;
		public $image;
		public $filename;

		public function __construct($data) {
			$this->names = $data['names'];
			$this->attending = $data['attending'];
			$this->song = $data['song'];
			$this->extra = $data['extra'];
			$this->image = $data['image'];
			$this->filename = sprintf('%s_%s.html', date('Y-m-d-His'), $this->names);
		}

		public function toHtml() {
			$html = sprintf('Names: %s <br>', $this->names);
			$html .= sprintf('Attending: %s <br>', $this->attending);
			$html .= sprintf('Song: %s <br>', $this->song);
			$html .= sprintf('Extra info: %s <br>', $this->extra);
			$html .= sprintf('Image: <img src="%s">', $this->image);
			return $html;
		}

		public function save() {
			return file_put_contents(sprintf('%s/%s', FILE_DESTINATION, $this->filename), $this->toHtml());
		}
	}

	RequestHandler::handle();


?>
