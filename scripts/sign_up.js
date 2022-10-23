const { ipcRenderer } = require('electron')
const fs = require('fs')
var fullname;
var password;
var confirmpassword;
var phonenumber;
var gender;
var birthday;

var video = null;
var canvas = null;
var numb;
var over_frame;

window.onload = function(){
    numb = document.querySelector(".numb");
    canvas = document.getElementById('canvas');
    document.querySelector('.btn-signup').addEventListener('click',function(){
        fullname = document.getElementById('fullname').value;
        password = document.getElementById('password').value;
        confirmpassword = document.getElementById('confirmpassword').value;
        birthday = document.getElementById('birthday').value;
        if(password == confirmpassword && password!=""){
            console.log(document.getElementById('camname').innerText);
            document.getElementById('camname').innerText = fullname +' 님';
            document.querySelector('.upper-frame').style.transform = 'translate(0, -90vh)'
            cam_on();
        }
        else {
            console.log('비밀번호가 일치하지 않습니다.')
        }
    })

    document.querySelector('.cam-back').addEventListener('click',function(){
        document.querySelector('.upper-frame').style.transform = 'translate(0, 0vh)'

    })
}

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
    return new Promise(function(resolve, reject){
        canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 600;
        context.translate(this.canvas.width,0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0, 800 , 600);
        var rnd = Math.floor(Math.random() * 1000);
        var dataURL = canvas.toDataURL('image/png');
        filePath = 'img'+ rnd +'.jpg'
        const base64Data = dataURL.replace(/^data:image\/png;base64,/, "");
        fs.writeFileSync(filePath, base64Data, 'base64', function (err) {
            console.log(err);
        });
        console.log(filePath)
        new Notification('캡쳐 완료', {body: '캡쳐가 완료되었습니다.'});
        console.log('capture')
        resolve(filePath)
    })
}
    

function cnt_down(){
    return new Promise(function(resolve, reject){
        numb = document.querySelector(".numb");
        over_frame = document.querySelector(".over-frame");
        over_frame.style.display = 'block';
        let counter = 3;
        numb.textContent = counter;
        let interval = setInterval(()=>{
            if(counter == 0){
                clearInterval(interval);
                //over_frame.style.display = 'none';
                resolve(true);
            }
            else{
                counter-=1;
                if(counter==0){
                    numb.textContent = '확인중';
                }
                else numb.textContent = counter;
    
            }
        }, 1000)
    })
}

async function test(){
    for(var i = 0; i<1; i++){
        var check = await cnt_down();
        console.log(i, 'promise done');
        filePath = await capture();
        console.log(filePath);
        console.log(i, 'capture done');
        ipcRenderer.send('api_call', filePath, 'image/check.jpg','faceCheck');
    }
}

ipcRenderer.on('api_call_result', (event, result)=>{
    console.log('ok')
    var number = JSON.parse(result)
    console.log('2', number.result);
    if(number.result == 0){
        numb.textContent = '확인불가';
    }
    else if(number.result ==1){
        over_frame.style.display = 'none'
    }
    else{
        numb.textContent = '1명보다 많은 얼굴이 보입니다'
    }
})

//test();