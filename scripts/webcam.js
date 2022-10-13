var video = null;
var canvas = null;
const fs = require('fs')
const { ipcRenderer } = require('electron')

function ok(){
    var rnd = Math.floor(Math.random() * 1000);
    var dataURL = canvas.toDataURL('image/png');
    filePath = 'img'+ rnd +'.jpg'
    const base64Data = dataURL.replace(/^data:image\/png;base64,/, "");
    fs.writeFile(filePath, base64Data, 'base64', function (err) {
        console.log(err);
    });
    ipcRenderer.send('api_call', filePath);
};

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

function capture(){
    var context = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;
    context.translate(this.canvas.width,0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0, 800 , 600);
    new Notification('캡쳐 완료', {body: '캡쳐가 완료되었습니다.'});
}

cam_on()