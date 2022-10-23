var s3_conn = {}

const multer = require('multer')
const multerS3 = require('multer-s3')
const AWS = require("aws-sdk")
const fs = require('fs')
const request = require('request')
require('dotenv').config();

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
})

var param = {
    'Bucket':'facekiosk',
    'Key': 'image/' + 'img.jpg',
    'ACL':'public-read',
    'Body':fs.createReadStream('img.jpg'),
    'ContentType':'image/jpg'
}

// s3_conn.upload = function(img){
//     console.log('./' + img);
//     param.Key = 'image/img.jpg';
//     param.Body = fs.createReadStream(img);
//     s3.upload(param, function(err, data){
//         if(err) {
//             console.log(err);
//         }
//         console.log(data.Location);
//         let loc = data.Location
//         const options = {
//             uri: process.env.FLASK + `fileDownload`,
//             qs:{
//                 object_name: 'image/img.jpg'
//                 //page: loc
//             }
//         }
          
//         r = request(options,function(err,reponse,body){
//             console.log(body)
//             })
//         try {
//             fs.unlinkSync(img)
//             //file removed
//         } catch(err) {
//                 console.error(err)
//         }
//     });
// }


// s3_conn.check = function(img){
//     console.log(img)
//     param.Key = 'image/check.jpg';
//     param.Body = fs.createReadStream(img);
//     s3.upload(param, function(err, data){
//         if(err){
//             console.log(err);
//         }
//         let loc = data.Location
//         const options = {
//             uri: `http://127.0.0.1:5000/faceCheck`,
//             qs:{
//                 object_name: 'check.jpg'
//                 //page: loc
//             }
//         }
          
//         r = request(options,function(err,reponse,body){
//             console.log(body)
//             })
//         try {
//             //fs.unlinkSync(img)
//             //file removed
//         } catch(err) {
//                 console.error(err)
//         }
//     })
// }


s3_conn.upload = function(target_img, s3_loc, api_name){
    return new Promise((resolve, reject) => {
        param.Key = s3_loc;
        param.Body = fs.createReadStream(target_img);
        s3.upload(param, async function(err, data){
            if(err){
                console.log(err);
            }
            let loc = data.Location
            const options = {
                uri: process.env.FLASK + api_name,
                qs:{
                    object_name: s3_loc
                    //page: loc
                }
            }
            var result;          
            try {
                fs.unlinkSync(target_img)
                //file removed
            } catch(err) {
                    console.error(err)
            }
            request(options,function(err,reponse,body){
                resolve(body);
                })

        })
    })
}



module.exports = s3_conn