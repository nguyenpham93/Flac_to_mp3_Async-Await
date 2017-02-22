//TODO: File này là file phối hợp giữa scanfile.js và converter.js
const Converter = require("./converter").Converter;
const ScanFile = require("./scanfile").ScanFile;
const Promise = require('bluebird');
const path = require('path');
const writer = require('fs').createWriteStream(__dirname + '/log.txt',{'flags': 'a'});

let srcFolder = __dirname + "/flac";
let desFolder = __dirname + "/mp3";
let count = 0;
let fileDone = 0;

/*** 
    Func chuyển .flac files thành .mp3 files
    Giới hạn 1 files 1 lần convert
    * @param arrFiles : mảng chứa đường dẫn tới các files .flac  
    * @param arrMp3 : mảng chưa các file mp3 chưa convert
*/

renderFile = (arrFlac,arrMp3,convert,totalFile)=>{
    if(arrFlac.length > 0){
        let tempFlac = arrFlac.slice(0);
        let tempMp3 = arrMp3.slice(0);
        tempFlac.forEach((file,index)=>{
            let inputFile = convert.sourceFolder + '/' + file;
            let outputFile = convert.destFolder + '/' + tempMp3[index];
            if(count < 2){
                count++;
                arrFlac.shift();
                arrMp3.shift();
                convert.flacToMp3(inputFile,outputFile)
                .then((success)=>{
                    fileDone++;
                    checkDone(fileDone,totalFile);                    
                    count--;
                    renderFile(arrFlac,arrMp3,convert,totalFile);
                },(err)=>{
                    fileDone++;
                    checkDone(fileDone,totalFile);
                    count--;
                    writer.write(err + '\n'); 
                    renderFile(arrFlac,arrMp3,convert,totalFile);
                });
                }
        });
    }
 }

 // Kiểm tra đã convert hết file chưa
 function checkDone(curDone,total){
    if(curDone == total){
        console.timeEnd("time convert");
    }
 }
/**
* @param srcFolder : đường dẫn tới thư mục flac
* @param desFolder : đường dẫn tới thư mục sau khi convert xong
*/
async function runner(srcFolder,desFolder){
    console.log('Converting ...');
    let myConvert = new Converter(srcFolder,desFolder);
    let myScanner = new ScanFile(srcFolder);
    //Get array .flac files (Tung) 
    let fileArrFlac = await myScanner.listAllFlac(myScanner.srcFolder);
    // Check and return array contains file not convert (Nam)
    let mp3Arr = myConvert.mp3Path(fileArrFlac);
    // Convert .flac to .mp3
    renderFile(fileArrFlac,mp3Arr,myConvert,fileArrFlac.length);
}

console.time("time convert");
runner(srcFolder,desFolder);
