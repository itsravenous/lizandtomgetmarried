<?php
function mail_attachment($to, $subject, $message, $from, $filename, $filedata) {
	$file_size = strlen($filedata);
	$content = chunk_split($filedata);
	$uid = md5(uniqid(time()));
	$from = str_replace(array("\r", "\n"), '', $from); // to prevent email injection
	$header = "From: ".$from."\r\n"
	."MIME-Version: 1.0\r\n"
	."Content-Type: multipart/mixed; boundary=\"".$uid."\"\r\n\r\n"
	."This is a multi-part message in MIME format.\r\n"
	."--".$uid."\r\n"
	."Content-type:text/plain; charset=iso-8859-1\r\n"
	."Content-Transfer-Encoding: 7bit\r\n\r\n"
	.$message."\r\n\r\n"
	."--".$uid."\r\n"
	."Content-Type: application/octet-stream; name=\"".$filename."\"\r\n"
	."Content-Transfer-Encoding: base64\r\n"
	."Content-Disposition: attachment; filename=\"".$filename."\"\r\n\r\n"
	.$content."\r\n\r\n"
	."--".$uid."--";
	return mail($to, $subject, "", $header);
}
?>
