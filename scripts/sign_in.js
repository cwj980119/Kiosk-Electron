var video = null;
var canvas = null;
const fs = require('fs')

function cam_on(){
    function errorCallback(e) {
        console.log('Error', e)
    }
    canvas = document.getElementById('canvas');
    
    navigator.getUserMedia({video: true, audio: false}, (localMediaStream) => {
        video = document.querySelector('video#cam')
        video.srcObject = localMediaStream
        video.autoplay = true
    }, (e) => {})
}

function capture(winRatio){
    return new Promise(async function(resolve, reject){
        canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        canvas.height = 480;
        canvas.width = canvas.height * winRatio;
        context.translate(this.canvas.width,0);
        context.scale(-1, 1);  
        imagex = (640 - canvas.width)/2
        context.drawImage(video, imagex, 0, canvas.width, 480, 0, 0, canvas.width , canvas.height);
        filePath = await image_save(canvas);
        console.log(filePath)
        new Notification('캡쳐 완료', {body: '캡쳐가 완료되었습니다.'});
        console.log('capture')
        resolve(filePath)
    })
}

function image_save(canvas){
    return new Promise((resolve, reject) => {
        var rnd = Math.floor(Math.random() * 1000000);
        var dataURL = canvas.toDataURL('image/png');
        filePath = 'img'+ rnd +'.jpg'
        const base64Data = dataURL.replace(/^data:image\/png;base64,/, "");
        fs.writeFileSync(filePath, base64Data, 'base64', function (err) {
            console.log(err);
        });
        resolve(filePath)
    })
    
}

function wait(sec){
    return new Promise((resolve, reject) => {
        setTimeout(function() {
            resolve();
          }, sec * 1000);
    })
}

async function test(){
    cam_on();
    await wait(3);
    console.log(window.innerWidth)
    ratio = window.innerWidth/window.innerHeight;
    capture(ratio)
    //await capture();
}
cam_on();
//test();