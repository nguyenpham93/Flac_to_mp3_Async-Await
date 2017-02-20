/**
 * Created by techmaster on 2/16/17.
 */
const spawn = require('child_process').spawn;
const Promise = require('bluebird');
const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
/***
 * Đây là class dùng để convert flac sang mp3. Tại sao phải dùng class bởi vì class sẽ lưu thêm
 */
exports.Converter = class {
  constructor(sourceFolder, destFolder) {
    this.sourceFolder = sourceFolder;
    this.destFolder = destFolder;
  }

  /** 
  * @param arrFlac : mảng chứa objects gồm src .flac & status 
  */
  // Module make by Nam
  mp3Path(arrFlac){
    let arrMp3 = [];
    arrFlac.forEach((file) => {
        let mp3Src = file.replace('.flac', '.mp3');
            arrMp3.push(mp3Src);
    });
    return arrMp3;
};

  /***
   *
   * @param inputFile input file định dạng flac, output file có tên giống với input file extenstion là mp3
   * @param inputFile là tên file không có đường dẫn
   */ 
  flacToMp3(inputFile,outputFile) {
    return new Promise((resolve, reject) => {
      let tempdir = outputFile.replace("/" + path.basename(outputFile),'');
      // shell module sử dụng để tạo full path
      shell.mkdir('-p',tempdir);
        const converter = spawn('ffmpeg', ['-y', '-i', inputFile, '-ab', '320k', '-map_metadata', '0', '-id3v2_version', '3', outputFile]);
        converter.stderr.on('data', (data) => {
        console.log(`${data}`);
      });
      converter.on('close', (code) => {
        if (code === 0) {
          resolve(inputFile);
        } else {
          reject(`File ${inputFile} caught error`);
        }
      });
    });
  }
}
