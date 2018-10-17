/*
 * @Author: cds 
 * @Date: 2018-10-17 16:16:44 
 * @Last Modified by: cds
 * @Last Modified time: 2018-10-17 16:46:05
 */

/**
 * 图片上传公共方法
 */

var formidable = require('formidable'),
    fs = require('fs'),
    TITLE = 'formidable上传示例',
    AVATAR_UPLOAD_FOLDER = '/faces/',
    domain = "http://localhost:3000";

var gmCut=require('./gmCut');

exports.upImg = function (req, callback) {
    var form = new formidable.IncomingForm(); //创建上传表单
    form.encoding = 'utf-8'; //设置编辑
    form.uploadDir = 'data' + AVATAR_UPLOAD_FOLDER; //设置上传目录
    form.keepExtensions = true; //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024; //文件大小
    var imgPathArr = [];
    var otherParmas = [];
    form.parse(req, function (err, fields, files) {

        if (err) {
            // res.locals.error = err;
            // res.send({
            //     status: -1,
            //     msg: '图片上传失败,请重试!'
            // });
            callback({
                status: -1,
                msg: '图片上传失败,请重试!'
            })
            return;
        }

        var extName = ''; //后缀名
        for (key in files) {
            switch (files[key].type) {
                case 'image/pjpeg':
                    extName = 'jpg';
                    break;
                case 'image/jpeg':
                    extName = 'jpg';
                    break;
                case 'image/png':
                    extName = 'png';
                    break;
                case 'image/x-png':
                    extName = 'png';
                    break;
            }

            if (extName.length == 0) {
                callback({
                    status: -1,
                    msg: '只支持png和jpg格式图片'
                })
                return;
            }
            var avatarName = parseInt(Math.random() * 100000) + '.' + extName;
            //图片写入地址；
            var newPath = form.uploadDir + avatarName;
            //显示地址；
            console.log("newPath", newPath);
            
            fs.renameSync(files[key].path, newPath); //重命名
            
            var jsonPath = {}
            jsonPath[key] = newPath;
            imgPathArr.push(jsonPath);

        }
        for (key in fields) {
            var jsonParma = {};
            jsonParma[key] = fields[key];
            otherParmas.push(jsonParma);
        }
        
        callback({
            status: 0,
            imgPathArr: imgPathArr,
            otherParmas: otherParmas
        })

    });
}