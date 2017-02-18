//ffmpeg -i demo.flac -ab 320k -map_metadata 0 -id3v2_version 3 demo.mp3
const exec = require('child_process').exec;
const converter = exec('ffmpeg -i demo.flac -ab 320k -map_metadata 0 -id3v2_version 3 demo.mp3; echo "demo.mp3"', (e, stdout, stderr) => {
  if (e instanceof Error) {
    console.error(e);
    throw e;
  }
  console.log('stdout ', stdout);
  console.log('stderr ', stderr);
});
