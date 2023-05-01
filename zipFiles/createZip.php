<?php
$files = array(
    ['https://i.redd.it/5ze9xe9r5vp31.png',"102042.jpg"],
    ['https://i.redd.it/tw4npub9oks31.gif',"21232.jpg"]
);

$zip = new ZipArchive();

# create a temp file & open it
$tmp_file = tempnam('.', '');
$zip->open($tmp_file, ZipArchive::CREATE);

# loop through each file
foreach ($files as $file) {
    # download file
    $download_file = file_get_contents($file[0]);

    #add it to the zip
    $zip->addFromString($file[1], $download_file);
}

# close zip
$zip->close();

# send the file to the browser as a download
header('Content-disposition: attachment; filename="my file.zip"');
header('Content-type: application/zip');
readfile($tmp_file);
unlink($tmp_file);
