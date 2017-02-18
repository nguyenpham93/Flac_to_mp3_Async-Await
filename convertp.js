/***
 * Sử dụng BlueBird promise
 */
const spawn = require('child_process').spawn;
const Promise = require('bluebird');

function flacToMp3(inputFile, outputFile) {

  return new Promise((resolve, reject) => {
    const converter = spawn('ffmpeg', ['-y', '-i', inputFile, '-ab', '320k', '-map_metadata', '0', '-id3v2_version', '3', outputFile]);

    converter.stderr.on('data', (data) => {
      console.log(`${data}`);
    });

    converter.on('close', (code) => {
      if (code === 0) {
        resolve(inputFile)
      } else {
        reject('failed to convert');
      }
    });
  });

}

flacToMp3('demo.flac', 'demo.mp3')
  .then((file) => {
    console.log(`${file} is converted`);
  })
  .catch((error) => {
    console.log(error);
  });

