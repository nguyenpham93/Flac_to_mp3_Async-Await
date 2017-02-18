//TODO: File này là file phối hợp giữa scanfile.js và converter.js
const Converter = require("./converter").Converter;
const ScanFile = require("./scanfile").ScanFile;
const Promise = require('bluebird');
const path = require('path');

let srcFolder = __dirname + "/flac";
let desFolder = __dirname + "/mp3";

/*** 
    Func chuyển .flac files thành .mp3 files
    Giới hạn 1 files 1 lần convert
    * @param arrFiles : mảng chứa đường dẫn tới các files .flac  
*/

//Nguyen
  renderFile = (arrFlac,arrMp3,convert)=>{
    var count = 0;
    var len = arrFlac.length;
    arrFlac.forEach((file,index)=>{
        let fileSrc = file.name;
        let fileStat = file.status;
        if(count < 2 && fileStat === 'not convert'){
            count++;
            convert.flacToMp3(fileSrc,arrMp3[index]).then((success)=>{
                file.status = 'done';
                count--;
                renderFile(arrFlac,arrMp3,convert);
            });
        }   
    });
 }

// Module make by Nam
 let mp3Path = (pathFlac,convert) => {
    let arrMp3 = [];
    pathFlac.forEach(file => {
        let filename = file.name;
        let desname = filename.replace(convert.sourceFolder,convert.destFolder);
        if (path.extname(desname) === '.flac') {
            let temp = desname.replace('.flac', '.mp3');
            arrMp3.push(temp);
        }
    });
    return arrMp3;
};

//cach 1
//  async function runner(srcFolder,desFolder){
//     var myConvert = new Converter(srcFolder,desFolder);
//     var myScanner = new ScanFile(srcFolder);
//     //Get array .flac files
//     var fileArr = await myScanner.listAllFlac(myScanner.srcFolder);
//     // Convert .flac to .mp3
//     renderFile(fileArr,myConvert);
//  }

// Sau khi Merge
async function runner(srcFolder,desFolder){
    var myConvert = new Converter(srcFolder,desFolder);
    var myScanner = new ScanFile(srcFolder);
    //Get array .flac files make By Tung
    var fileArrFlac = await myScanner.listAllFlac(myScanner.srcFolder);
    // Nam
    var fileArrMp3 = mp3Path(fileArrFlac,myConvert);

    // Convert .flac to .mp3
    renderFile(fileArrFlac,fileArrMp3,myConvert);
 }
 runner(srcFolder,desFolder);


