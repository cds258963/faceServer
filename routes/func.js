/*
 * @Author: cds.only 
 * @Date: 2018-10-14 23:32:53 
 * @Last Modified by: cds.only
 * @Last Modified time: 2018-10-15 23:56:23
 */

/**
 * how to use face-recognition
 */
const path = require('path')
const fs = require('fs')
const fr = require('face-recognition')
const dataPath = path.resolve('./data/faces')


//保存处理图片
exports.saveAndDealFacePic = function (classNames, fp) {
    const detector = fr.FaceDetector()
    const targetSize = 150
    const image = fr.loadImage(fp);
    const faceImages = detector.detectFaces(image, targetSize);
    if (faceImages[0]) {
        faceImages.forEach(function (img, i) {
            var randomNum = parseInt(Math.random() * 1000000);
            if (classNames) {
                fr.saveImage(`./data/dealFace/face_${classNames}_${randomNum}.png`, img);
            } else {
                fr.saveImage(`./data/dealFace/face_${randomNum}.png`, img);
            }

        })
        return faceImages[0];
    }else{
        
    }

};

//训练识别器
exports.trainFaceData = function (faces, name) {
    console.log('faces')
    console.log(faces);
    //训练识别器

    var recognizer = fr.FaceRecognizer();

    recognizer.addFaces(faces, name);

    //加载识别器内容
    // const modelState1 = JSON.parse(fs.readFileSync('./data/faceJson/model.json'));


    var modelState2 = recognizer.serialize();
    try {
        const modelState1 = JSON.parse(fs.readFileSync('./data/faceJson/model.json'));
        if (modelState1) {
            modelState2 = modelState2.concat(modelState1);
        }
    } catch (error) {
        console.log(error)
    }

    //保存识别器内容

    fs.writeFileSync('./data/faceJson/model.json', JSON.stringify(modelState2))
};


//识别人脸
exports.predictBestFace = function (face) {
    const modelState = JSON.parse(fs.readFileSync('./data/faceJson/model.json'));
    var recognizer = fr.FaceRecognizer();
    recognizer.load(modelState);
    const prediction = recognizer.predictBest(face)
    console.log('predictBest:')
    console.log(prediction);
    const predictions = recognizer.predict(face)

    console.log('predict:')
    console.log(predictions)
};