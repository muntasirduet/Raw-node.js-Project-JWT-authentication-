/**
 * data js
 */


const fs = require('fs');
const path = require('path');

const lib = {};

//base directory of data folder

lib.basedir = path.join(__dirname,'/../.data')

//write data to file 

lib.create = (dir,file,data,callback) => {
    //open file for writting 

    fs.open(`${lib.basedir }/${dir}/${file}.json`, 'wx',(err,fileDescriptor)=>{
        if(!err && fileDescriptor){
            const stringData = JSON.stringify(data);

            fs.writeFile(fileDescriptor, stringData,(err1)=> {
                if(!err1){
                    fs.close(fileDescriptor,(err2) => {
                        if(!err2){
                            callback(false);
                        }else{
                            callback('Error Closing the new file')
                        }
                    });
                }else{
                    callback('Error Writing to new file');
                }
            })
        }else{
            callback(`file already exist `);
        }
    });


}

lib.read = (dir,file,callback) => { 
    fs.readFile(`${lib.basedir }/${dir}/${file}.json`,'utf8',(err,data) => {
        callback(err,data);
    })
}


lib.update = (dir,file,data,callback) => {

    fs.open(`${lib.basedir }/${dir}/${file}.json`,'r+',(err,fileDescriptor) => {

        if(!err && fileDescriptor){
            const stringData = JSON.stringify(data);

            fs.ftruncate(fileDescriptor,(err1) =>{
                if(!err1){

                    fs.writeFile(fileDescriptor, stringData,(err2)=> {
                        if(!err2){

                            fs.close(fileDescriptor,(err3) => {
                                if(!err3){
                                    callback(false);
                                }else{
                                    callback('Error Closing the file')
                                }
                            });
                        }else{
                            callback('Error Writing to file');
                        }
                    })
                }
                else{
                    callback('error truncate file');
                }
            })
        }else{
            callback('file does not exist');
        }
    })
}


lib.delete = (dir,file,callback) =>{
    fs.unlink(`${lib.basedir }/${dir}/${file}.json`,(err) => {
        if(!err){
            callback(false);
        }else{
            callback('errorn deleting file');
        }
    })
}




module.exports = lib;