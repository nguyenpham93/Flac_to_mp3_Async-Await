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
   *
   * @param inputFile
   */
  //TODO: hãy viết hàm để tìm ra outputFile phù hợp dựa vào sourceFolder, destFolder và inputFile
  // getOutputFile(inputFile){
  //   let temp = inputFile.replace(this.sourceFolder,this.destFolder);
  //   let temp1 = temp.replace('.flac','.mp3');
  //   return temp1;
  // }

  /***
   *
   * @param inputFile input file định dạng flac, output file có tên giống với input file extenstion là mp3
   * @param inputFile là tên file không có đường dẫn
   */ 
  flacToMp3(inputFile,outputFile) {
    return new Promise((resolve, reject) => {

      // let outputFile = this.getOutputFile(inputFile);
      let tempdir = outputFile.replace("/" + path.basename(outputFile),'');
      // shell module sử dụng để tạo full path
      shell.mkdir('-p',tempdir);
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
}
