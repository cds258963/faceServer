/*
 * @Author: cds.only 
 * @Date: 2018-10-14 23:32:53 
 * @Last Modified by: cds
 * @Last Modified time: 2018-10-16 13:40:49
 */

/**
 * how to use face-recognition
 */
const path = require('path');
const fs = require('fs');
const fr = require('face-recognition');
const dataPath = path.resolve('./data/faces');
const Arr = require('../util/concatArr');


//保存处理图片
exports.saveAndDealFacePic = function (classNames, fp) {
    const detector = fr.FaceDetector();
    const targetSize = 150;
    const image = fr.loadImage(fp);
    // if (!classNames) {
    //     return {
    //         status: 0,
    //         msg: image
    //     };
    // } else {
    // console.log(image);
    console.log(222);
    //识别人脸时的速度很慢
    const faceImages = detector.detectFaces(image, targetSize);
    console.log(333);
    if (faceImages.length > 0) {
        faceImages.forEach(function (img, i) {
            var randomNum = parseInt(Math.random() * 1000000);
            if (classNames) {
                fr.saveImage(`./data/dealFace/face_${classNames}_${randomNum}.png`, img);
            } else {
                fr.saveImage(`./data/dealFace/face_${randomNum}.png`, img);
            }

        })
        return {
            status: 0,
            msg: faceImages
        };

    } else {
        return {
            status: -1,
            msg: '未找到人脸'
        };
    }
    // }

};

//训练识别器
exports.trainFaceData = function (faces, name) {
    //训练识别器
    var recognizer = fr.FaceRecognizer();
    //抖动版本的数量
    const numJitters = 15
    recognizer.addFaces(faces, name, numJitters);

    //加载识别器内容

    var newModelState = recognizer.serialize();
    try {
        //获取到原有的训练模型，如果存在则将本次训练模型和已有训练模型合并（同时去重）
        const oldModelState = JSON.parse(fs.readFileSync('./data/faceJson/model.json'));
        if (oldModelState) {
            // newModelState = newModelState.concat(oldModelState);
            newModelState = Arr.MergeArray(newModelState, oldModelState);
        }
    } catch (error) {
        console.log(error)
    }
    //保存识别器内容
    fs.writeFileSync('./data/faceJson/model.json', JSON.stringify(newModelState));
};


//识别人脸
exports.predictBestFace = function (face) {
    const modelState = JSON.parse(fs.readFileSync('./data/faceJson/model.json'));
    var recognizer = fr.FaceRecognizer();
    recognizer.load(modelState);
    var predictionsObj={

    };
    for (var i = 0; i < face.length; i++) {
        // const prediction = recognizer.predictBest(face[i]);
        // console.log('predictBest:');
        // console.log(prediction);
        const predictions = recognizer.predict(face[i]);
        console.log('predict:');
        console.log(predictions);
        predictionsObj[i]=predictions;
    }
    return {
        status: 0,
        msg: {
            predictions:predictionsObj
        }
    }

};