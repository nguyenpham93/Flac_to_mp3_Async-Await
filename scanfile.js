
//TODO: Hãy viết lệnh để liệt kê tất cả các file phù hợp với một pattern đề ra trả về danh sách các file quét được
//
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');

 exports.ScanFile = class {

    /*** Constructor
     * @param sourceFolder đường dẫn tới thư mục file flac
     * 
     */ 
    constructor(sourceFolder){
        this.srcFolder = sourceFolder;
    }

    /***
     * Hàm liệt kê danh sách file
     * @param dir
     * @param files_
     * @returns {*|Array}
     */
    getFiles(dir, files_) {
        files_ = files_ || [];
        let files = fs.readdirSync(dir);
        for (let i in files) {
            let name = dir + '/' + files[i];
            if (fs.statSync(name).isDirectory()) {
                this.getFiles(name, files_);
            } else {
                files_.push(name);
            }
        }
        return files_;
    }

    /***
     * Hàm kiểm tra file .flac
     * @param file
     * @returns {*}
     */
    // checkFlac(file) {
    //     return path.extname(file);
    // }

    // checkFlac() Cach 2
    checkFlac(file,extname) {
        if(path.extname(file) === extname)
        {
            return true;
        }else{
            return false;
        }
    }
    

    /***
     * Hàm liệt kê danh sách .flac file
     * @param dir
     * @returns {Array}
     */
    addFlac(dir,check) {
        return new Promise((resolve, reject) => {
            let allFiles = this.getFiles(dir);
            //console.log(allFiles);
            var flacFiles = [];
            allFiles.forEach(file => {
                // if (this.checkFlac(file) === '.flac') {
                //     flacFiles.push({name: file, status: 'not convert'});
                // }
                if(check(file,'.flac')){
                    flacFiles.push({name: file, status: 'not convert'});
                }
            });
            resolve(flacFiles);
        });
    }

    /***
     * Hàm hứng kết quả trả về từ hàm addFlac
     * @param dir
     * @returns {Promise.<Array>}
     */
    async listAllFlac(dir) {
        let arrFlac = await this.addFlac(dir,this.checkFlac);
        return arrFlac;
    }
}

