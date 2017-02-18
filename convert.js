/***
 * Sử dụng hàm call back bình thường
 */

//ffmpeg -i demo.flac -ab 320k -map_metadata 0 -id3v2_version 3 demo.mp3
const spawn = require('child_process').spawn;

/***
 * Convert flac sang mp3 sử dụng ffmpeg, ghi đè nếu file đã tồn tại, nén 320kbps, có lưu lại metadata
 * @param inputFile
 * @param outputFile
 * @param callback hàm call back sau khi convert xong
 */
function flacToMp3(inputFile, outputFile, callback) {
  const converter = spawn('ffmpeg', ['-y', '-i', inputFile, '-ab', '320k', '-map_metadata', '0', '-id3v2_version', '3', outputFile]);

  converter.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  converter.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  converter.on('close', (code) => {
    // if (code === 0) {
    //   callback(inputFile);
    // }
    console.log("process closed");
  });
}

flacToMp3('a.flac', 'a.mp3', (a) => {
  console.log(`${a} is converted`);
});

