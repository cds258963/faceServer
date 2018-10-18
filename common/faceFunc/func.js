/*
 * @Author: cds.only 
 * @Date: 2018-10-14 23:32:53 
 * @Last Modified by: cds
 * @Last Modified time: 2018-10-18 16:50:12
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
    console.log(222);
    //识别人脸时的速度很慢 如果传入如果传入尺寸为150的图片 处理速度很快
    const faceImages = detector.detectFaces(image, targetSize);
    console.log(333);
    if (faceImages.length > 0) {
        // faceImages.forEach(function (img, i) {
        //     var randomNum = parseInt(Math.random() * 1000000);
        //     if (classNames) {
        //         fr.saveImage(`./data/dealFace/face_${classNames}_${randomNum}.png`, img);
        //     } else {
        //         fr.saveImage(`./data/dealFace/face_${randomNum}.png`, img);
        //     }
        // }) 
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

};

/*
 * 训练识别器
 */
exports.trainFaceData = function (faces, name) {
    //训练识别器
    var recognizer = fr.FaceRecognizer();
    //抖动版本的数量
    const numJitters = 15;
    console.log('训练......');
    recognizer.addFaces(faces, name, numJitters);
    console.log('训练完成......');

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

/**
 * 识别人脸
 * 
 */

exports.predictBestFace = function (face) {
    console.log(face);
    //加载人脸训练模型数据
    const modelState = JSON.parse(fs.readFileSync('./data/faceJson/model.json'));
    var recognizer = fr.FaceRecognizer();
    recognizer.load(modelState);

    //识别人脸
    var predictionsObj = {};
    var predictionObj = {};
    for (var i = 0; i < face.length; i++) {
        const prediction = recognizer.predictBest(face[i]);
        console.log('predictBest:');
        console.log(prediction);
        predictionObj[i] = prediction;
        // const predictions = recognizer.predict(face[i]);
        // console.log('predict:');
        // console.log(predictions);
        // predictionsObj[i] = predictions;
    }
    return {
        status: 0,
        msg: {
            // predictions: predictionsObj,
            predictionObj: predictionObj
        }
    }

};