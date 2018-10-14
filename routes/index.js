/*
 * @Author: cds.only 
 * @Date: 2018-10-14 18:17:29 
 * @Last Modified by: cds.only
 * @Last Modified time: 2018-10-14 23:00:01
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});
/**
 * how to use face-recognition
 */
const path = require('path')
const fs = require('fs')
const fr = require('face-recognition')

const dataPath = path.resolve('./data/comeFaces')
const classNames = ['sheldon', 'lennard', 'raj', 'howard', 'stuart']

const allFiles = fs.readdirSync(dataPath)
const imagesByClass = classNames.map(c =>
  allFiles
  .filter(f => f.includes(c))
  .map(f => path.join(dataPath, f))
  .map(fp => fr.loadImage(fp))
)
//处理图片
// const detector = fr.FaceDetector()
// const targetSize = 150
// const imagesByClass = classNames.map(c =>
//   allFiles
//   .filter(f => f.includes(c))
//   .map(f => path.join(dataPath, f))
//   .map(function (fp) {
//     const image=fr.loadImage(fp);
//     const faceImages = detector.detectFaces(image, targetSize);
//     console.log(faceImages);
//     // faceImages.forEach((img, i) => fr.saveImage(img, `face_${i}.png`))
//     faceImages.forEach(function (img, i) {
//       // console.log(img);
//       fr.saveImage(`./data/comeFaces/face_${c}_${Math.random()*1000000}.png`, img);

//     })
//   })
// )

// console.log(imagesByClass)
const numTrainingFaces = 5
const trainDataByClass = imagesByClass.map(imgs => imgs.slice(0, numTrainingFaces))
const testDataByClass = imagesByClass.map(imgs => imgs.slice(numTrainingFaces))

// console.log('trainDataByClass：');
// console.log(trainDataByClass);
// console.log('testDataByClass：');
// console.log(testDataByClass);

//训练识别器
const recognizer = fr.FaceRecognizer()

trainDataByClass.forEach((faces, label) => {
  // console.log(faces);
  const name = classNames[label];
  recognizer.addFaces(faces, name)
})

// for(var i=0;i<trainDataByClass.length;i++){
//   var faces=trainDataByClass[i];
//    console.log(faces);
//    console.log('label：'+i);
//    var name = classNames[i];
//    console.log('name:'+name);
//    recognizer.addFaces(faces, name)
// }
// //保存识别器内容
const modelState = recognizer.serialize()
// console.log(modelState);
fs.writeFileSync('./data/faceJson/model.json', JSON.stringify(modelState))





/**
 * 检测人脸
 */
// const image = fr.loadImage('./public/images/img1.jpg')
// const detector = fr.FaceDetector()
// const targetSize = 150
// const faceImages = detector.detectFaces(image, targetSize);
// // console.log(faceImages);
// // faceImages.forEach((img, i) => fr.saveImage(img, `face_${i}.png`))
// faceImages.forEach(function (img, i) {
//   // console.log(img);
//   fr.saveImage(`./data/comeFaces/face_${i}.png`, img);

// })





//加载识别器内容
// const modelState = require('./data/faceJson/model.json')
// recognizer.load(modelState)

//测试识别
const errors = classNames.map(_ => [])
testDataByClass.forEach((faces, label) => {
  const name = classNames[label]
  console.log()
  console.log('testing %s', name)
  faces.forEach((face, i) => {
    const prediction = recognizer.predictBest(face)
    console.log('%s (%s)', prediction.className, prediction.distance)

    // count number of wrong classifications
    if (prediction.className !== name) {
      errors[label] = errors[label] + 1
    }
  })
})

// print the result
const result = classNames.map((className, label) => {
  const numTestFaces = testDataByClass[label].length
  const numCorrect = numTestFaces - errors[label].length
  const accuracy = parseInt((numCorrect / numTestFaces) * 10000) / 100
  return `${className} ( ${accuracy}% ) : ${numCorrect} of ${numTestFaces} faces have been recognized correctly`
})
console.log('result:')
console.log(result)


module.exports = router;