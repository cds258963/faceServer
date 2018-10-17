/*
 * @Author: cds 
 * @Date: 2018-10-17 10:56:27 
 * @Last Modified by: cds
 * @Last Modified time: 2018-10-17 17:14:59
 */


/**
 * 裁剪处理图片大小
 */
// var fs = require('fs')
var gm = require('gm');

exports.cutfacePic = function (path, callback) {
    console.log('gm:' + path)
    //处理不同环境下的路径问题'/'和'\'的问题
    gm(path)
        .resize(150, 150)
        .noProfile()
        .write(path, function (err) {
            if (!err) {
                console.log('done');
                 callback({
                    status: 0,
                    msg: path
                })
            } else {
                console.log(err);
                 callback({
                    status: -1,
                    msg: err
                })
            }
        });
}