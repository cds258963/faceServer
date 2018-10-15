/*
 * @Author: cds.only 
 * @Date: 2018-10-14 18:17:29 
 * @Last Modified by: cds.only
 * @Last Modified time: 2018-10-15 23:18:49
 */
var express = require('express');
var router = express.Router();
var formidable = require('formidable'),
  fs = require('fs'),
  TITLE = 'formidable上传示例',
  AVATAR_UPLOAD_FOLDER = '/faces/',
  domain = "http://localhost:3000";
//引入处理模块
var func = require('./func')
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});


//上传待识别图片
router.post('/uploader', function (req, res, next) {
  var form = new formidable.IncomingForm(); //创建上传表单
  form.encoding = 'utf-8'; //设置编辑
  form.uploadDir = 'data' + AVATAR_UPLOAD_FOLDER; //设置上传目录
  form.keepExtensions = true; //保留后缀
  form.maxFieldsSize = 2 * 1024 * 1024; //文件大小

  form.parse(req, function (err, fields, files) {

    if (err) {
      res.locals.error = err;
      res.render('index', {
        title: TITLE
      });
      return;
    }
    // console.log(fields);
    // console.log(files);
    var classNames = fields.name;
    var addFace=[];
    for (key in files) {


      var extName = ''; //后缀名
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
        res.locals.error = '只支持png和jpg格式图片';
        res.render('index', {
          title: TITLE
        });
        return;
      }
      var avatarName = fields.name + '_' + parseInt(Math.random() * 100000) + '.' + extName;
      //图片写入地址；
      var newPath = form.uploadDir + avatarName;
      //显示地址；
      var showUrl = domain + AVATAR_UPLOAD_FOLDER + avatarName;
      console.log("newPath", newPath);
      fs.renameSync(files[key].path, newPath); //重命名
      
      addFace.push(func.saveAndDealFacePic(classNames, newPath));
    }
    //训练识别器
    func.trainFaceData(addFace,classNames);

    res.json({
      "newPath": showUrl
    });
  });
});

router.post('/uploader1', function (req, res, next) {
  var form = new formidable.IncomingForm(); //创建上传表单
  form.encoding = 'utf-8'; //设置编辑
  form.uploadDir = 'data' + AVATAR_UPLOAD_FOLDER; //设置上传目录
  form.keepExtensions = true; //保留后缀
  form.maxFieldsSize = 2 * 1024 * 1024; //文件大小

  form.parse(req, function (err, fields, files) {

    if (err) {
      res.locals.error = err;
      res.render('index', {
        title: TITLE
      });
      return;
    }
    // console.log(fields);
    // console.log(files);
    var addFace=[];


      var extName = ''; //后缀名
      switch (files.face.type) {
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
        res.locals.error = '只支持png和jpg格式图片';
        res.render('index', {
          title: TITLE
        });
        return;
      }
      var avatarName = parseInt(Math.random() * 100000) + '.' + extName;
      //图片写入地址；
      var newPath = form.uploadDir + avatarName;
      //显示地址；
      var showUrl = domain + AVATAR_UPLOAD_FOLDER + avatarName;
      console.log("newPath", newPath);
      fs.renameSync(files.face.path, newPath); //重命名
      
      var beforeFace=func.saveAndDealFacePic('', newPath);
    //训练识别器
    func.predictBestFace(beforeFace);

    res.json({
      "newPath": showUrl
    });
  });
});

/**
 * how to use face-recognition
 */
// const path = require('path')
// // const fs = require('fs')
// const fr = require('face-recognition')

// const dataPath = path.resolve('./data/comeFaces')
// const classNames = ['sheldon', 'lennard', 'raj', 'howard', 'stuart']

// const allFiles = fs.readdirSync(dataPath)
// const imagesByClass = classNames.map(c =>
//   allFiles
//   .filter(f => f.includes(c))
//   .map(f => path.join(dataPath, f))
//   .map(fp => fr.loadImage(fp))
// )
// //处理图片
// // const detector = fr.FaceDetector()
// // const targetSize = 150
// // const imagesByClass = classNames.map(c =>
// //   allFiles
// //   .filter(f => f.includes(c))
// //   .map(f => path.join(dataPath, f))
// //   .map(function (fp) {
// //     const image=fr.loadImage(fp);
// //     const faceImages = detector.detectFaces(image, targetSize);
// //     console.log(faceImages);
// //     // faceImages.forEach((img, i) => fr.saveImage(img, `face_${i}.png`))
// //     faceImages.forEach(function (img, i) {
// //       // console.log(img);
// //       fr.saveImage(`./data/comeFaces/face_${c}_${Math.random()*1000000}.png`, img);

// //     })
// //   })
// // )

// // console.log(imagesByClass)
// const numTrainingFaces = 5
// const trainDataByClass = imagesByClass.map(imgs => imgs.slice(0, numTrainingFaces))
// const testDataByClass = imagesByClass.map(imgs => imgs.slice(numTrainingFaces))

// // console.log('trainDataByClass：');
// // console.log(trainDataByClass);
// // console.log('testDataByClass：');
// // console.log(testDataByClass);

// //训练识别器
// const recognizer = fr.FaceRecognizer()

// trainDataByClass.forEach((faces, label) => {
//   // console.log(faces);
//   const name = classNames[label];
//   recognizer.addFaces(faces, name)
// })

// // for(var i=0;i<trainDataByClass.length;i++){
// //   var faces=trainDataByClass[i];
// //    console.log(faces);
// //    console.log('label：'+i);
// //    var name = classNames[i];
// //    console.log('name:'+name);
// //    recognizer.addFaces(faces, name)
// // }
// // //保存识别器内容
// const modelState = recognizer.serialize()
// // console.log(modelState);
// fs.writeFileSync('./data/faceJson/model.json', JSON.stringify(modelState))





// /**
//  * 检测人脸
//  */
// // const image = fr.loadImage('./public/images/img1.jpg')
// // const detector = fr.FaceDetector()
// // const targetSize = 150
// // const faceImages = detector.detectFaces(image, targetSize);
// // // console.log(faceImages);
// // // faceImages.forEach((img, i) => fr.saveImage(img, `face_${i}.png`))
// // faceImages.forEach(function (img, i) {
// //   // console.log(img);
// //   fr.saveImage(`./data/comeFaces/face_${i}.png`, img);

// // })





// //加载识别器内容
// // const modelState = require('./data/faceJson/model.json')
// // recognizer.load(modelState)

// //测试识别
// const errors = classNames.map(_ => [])
// testDataByClass.forEach((faces, label) => {
//   const name = classNames[label]
//   console.log()
//   console.log('testing %s', name)
//   faces.forEach((face, i) => {
//     const prediction = recognizer.predictBest(face)
//     console.log('%s (%s)', prediction.className, prediction.distance)

//     // count number of wrong classifications
//     if (prediction.className !== name) {
//       errors[label] = errors[label] + 1
//     }
//   })
// })

// // print the result
// const result = classNames.map((className, label) => {
//   const numTestFaces = testDataByClass[label].length
//   const numCorrect = numTestFaces - errors[label].length
//   const accuracy = parseInt((numCorrect / numTestFaces) * 10000) / 100
//   return `${className} ( ${accuracy}% ) : ${numCorrect} of ${numTestFaces} faces have been recognized correctly`
// })
// console.log('result:')
// console.log(result)


module.exports = router;