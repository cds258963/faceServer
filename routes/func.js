/*
 * @Author: cds.only 
 * @Date: 2018-10-14 23:32:53 
 * @Last Modified by: cds
 * @Last Modified time: 2018-10-15 17:36:22
 */

/**
 * how to use face-recognition
 */
const path = require('path')
const fs = require('fs')
const fr = require('face-recognition')
const dataPath = path.resolve('./data/faces')


//保存处理图片
exports.saveAndDealFacePic = function (classNames) {
    console.log(classNames);
    const allFiles = fs.readdirSync(dataPath)
    const detector = fr.FaceDetector()
    const targetSize = 150
    console.log(allFiles);
    classNames.map(c =>
        allFiles
        .filter(f => f.includes(c))
        .map(f => path.join(dataPath, f))
        .map(function (fp) {
            console.log(fp);
            const image = fr.loadImage(fp);
            const faceImages = detector.detectFaces(image, targetSize);
            console.log(faceImages);
            // faceImages.forEach((img, i) => fr.saveImage(img, `face_${i}.png`))
            faceImages.forEach(function (img, i) {
                // console.log(img);
                fr.saveImage(`./data/comeFaces/face_${c}_${parseInt(Math.random()*1000000)}.png`, img);

            })
        })
    )
};

//训练识别器
exports.trainFaceData = function () {

    
    const classNames = ['sheldon', 'lennard', 'raj', 'howard', 'stuart']

    const allFiles = fs.readdirSync(dataPath)
    const imagesByClass = classNames.map(c =>
        allFiles
        .filter(f => f.includes(c))
        .map(f => path.join(dataPath, f))
        .map(fp => fr.loadImage(fp))
    )

    const numTrainingFaces = 5
    const trainDataByClass = imagesByClass.map(imgs => imgs.slice(0, numTrainingFaces))

    //训练识别器

    const recognizer = fr.FaceRecognizer()

    trainDataByClass.forEach((faces, label) => {
        // console.log(faces);
        const name = classNames[label];
        recognizer.addFaces(faces, name)
    })
    //保存识别器内容
    const modelState = recognizer.serialize()
    // console.log(modelState);
    fs.writeFileSync('./data/faceJson/model.json', JSON.stringify(modelState))
};


//识别人脸
exports.predictBestFace=function(){

};