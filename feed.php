<?php
$ch = curl_init("http://newsrack.in/rss/rohitkumar/Radiohello/Media-Feeds/rss.xml");
curl_exec($ch);
curl_close($ch);
?>
