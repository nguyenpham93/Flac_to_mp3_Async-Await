
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
                let shortName = this.cutPath(name);
                files_.push(shortName);
            }
        }
        return files_;
    }

    // To make path shorter
    cutPath(path){
        return path.replace(this.srcFolder + '/','');
    }

    /***
     * Hàm kiểm tra file .flac
     * @param file
     * @returns true/false
     */

    // checkFlac()
    checkFlac(file) {
        return path.extname(file) === '.flac' ?  true : false;
    }
    
    /***
     * Hàm liệt kê danh sách .flac file
     * @param dir
     * @returns {Array}
     */
    addFlac(dir,check) {
        return new Promise((resolve, reject) => {
            let allFiles = this.getFiles(dir);
            var flacFiles = [];
            allFiles.forEach(file => {
                if(check(file)){
                    flacFiles.push(file);
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

