//TODO: File này là file phối hợp giữa scanfile.js và converter.js
const Converter = require("./converter").Converter;
const ScanFile = require("./scanfile").ScanFile;
const Promise = require('bluebird');
const path = require('path');
const writer = require('fs').createWriteStream(__dirname + '/log.txt',{'flags': 'a'});

let srcFolder = __dirname + "/flac";
let desFolder = __dirname + "/mp3";
let count = 0;

/*** 
    Func chuyển .flac files thành .mp3 files
    Giới hạn 1 files 1 lần convert
    * @param arrFiles : mảng chứa đường dẫn tới các files .flac  
*/

renderFile = (arrFlac,arrMp3,convert)=>{
    if(arrFlac.length > 0){
        let tempFlac = [];
        let tempMp3 = [];
        arrFlac.forEach((file,index)=>{
            tempFlac.push(file);
            tempMp3.push(arrMp3[index]);
        });
        tempFlac.forEach((file,index)=>{
            let inputFile = convert.sourceFolder + '/' + file;
            let outputFile = convert.destFolder + '/' + tempMp3[index];
            if(count < 2){
                count++;
                arrFlac.shift();
                arrMp3.shift();
                convert.flacToMp3(inputFile,outputFile)
                .then((success)=>{
                    count--;
                    if(arrFlac.length == 0){
                        console.timeEnd("convert");
                    }
                    renderFile(arrFlac,arrMp3,convert);
                    },(err)=>{
                        count--;
                        writer.write(err + '\n'); 
                        renderFile(arrFlac,arrMp3,convert);
                    });
                }
        });
    }
 }
/**
* @param srcFolder : đường dẫn tới thư mục flac
* @param desFolder : đường dẫn tới thư mục sau khi convert xong
*/
async function runner(srcFolder,desFolder){
    var myConvert = new Converter(srcFolder,desFolder);
    var myScanner = new ScanFile(srcFolder);
    //Get array .flac files make By Tung
    var fileArrFlac = await myScanner.listAllFlac(myScanner.srcFolder);
    // Nam
    var fileArrMp3 = myConvert.mp3Path(fileArrFlac);
    // Convert .flac to .mp3
    renderFile(fileArrFlac,fileArrMp3,myConvert);
}

console.time("convert");
runner(srcFolder,desFolder);
