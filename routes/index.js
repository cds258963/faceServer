/*
 * @Author: cds.only 
 * @Date: 2018-10-14 18:17:29 
 * @Last Modified by: cds
 * @Last Modified time: 2018-10-22 13:08:05
 */
var express = require('express');
var router = express.Router();

var Q = require('q');
var defer = Q.defer();

var formidable = require('formidable'),
    fs = require('fs'),
    TITLE = 'formidable上传示例',
    AVATAR_UPLOAD_FOLDER = '/faces/',
    domain = "http://localhost:3000";
//引入处理模块
var func = require('../common/faceFunc/func');
//引入图片处理模块
var gmCut = require('../common/util/gmCut');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});


var upimg = require('../common/util/upimg');



router.post('/upimg', function (req, res, next) {
    upimg.upImg(req, function (data) {
        console.log(data)
        if (data.status == 0) {
            console.log(data)
        } else {
            res.send({
                status: -1,
                msg: data.msg
            })
        }
    })
})
//上传训练
router.post('/upImgToTrain', function (req, res, next) {
    upimg.upImg(req, function (data) {
        console.log(data);
        var response;
        if (data.status == 0) {
            var classNames;
            data.otherParmas.map(function (item, index) {
                for (key in item) {
                    if (key == 'classNames') {
                        classNames = item[key];
                    }
                }
            })
            console.log(classNames)
            var faceArr = [];
            data.imgPathArr.map(function (item, index) {
                var imageStatus = func.saveAndDealFacePic(classNames, item);
                if (imageStatus.status == 0) {
                    var newArr = faceArr;
                    faceArr = faceArr.concat(imageStatus.msg)
                } else {
                    response = {
                        status: -1,
                        msg: `${key}训练图片中有未找到人脸的图片，请重新上传!`
                    };
                }
            })
            //训练识别器(判断处理过后的训练图片张数；小于5张则不进行训练，提示重新提交)
            if (faceArr.length < 5) {
                response = {
                    status: -1,
                    msg: '训练图片中有未找到人脸的图片，请重新上传!'
                };
            } else {
                //将获取到的人脸图片进行训练，生成训练模型并修改现有模型并保存
                console.log(faceArr);
                func.trainFaceData(faceArr, classNames);
                response = {
                    status: 0,
                    msg: '训练成功!'
                };
            }
        } else {
            response = {
                status: -1,
                msg: data.msg
            };
        }
        res.send(response);
    })
})

//上传识别
router.post('/upImgToRecognition', function (req, res, next) {
    var response;
    var classNames = '';
    upimg.upImg(req, function (data) {
        console.log(data)
        if (data.status == 0) {
            var faceArr = [];
            data.imgPathArr.map(function (item, index) {
                var imageStatus = func.saveAndDealFacePic(classNames, item);
                console.log(imageStatus);
                if (imageStatus.status == 0) {
                    var newArr = faceArr;
                    faceArr = faceArr.concat(imageStatus.msg)
                } else {
                    response = {
                        status: -1,
                        msg: `${key}识别图片中有未找到人脸的图片，请重新上传!`
                    };
                }
            })
            var afterFace = func.predictBestFace(faceArr);
            if (afterFace.status == 0) {
                response = {
                    status: 0,
                    msg: afterFace.msg
                };
            }
        } else {
            response = {
                status: -1,
                msg: data.msg
            };
        }
        res.send(response);
    })
})




module.exports = router;