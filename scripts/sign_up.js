//const { ipcRenderer } = require('electron')
var fullname;
var password;
var confirmpassword;
var phonenumber;
var gender;
var birthday;

var video = null;
var canvas = null;
var numb;

window.onload = function(){
    numb = document.querySelector(".numb");
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

function cnt_down(){
    numb = document.querySelector(".numb");
    over_frame = document.querySelector(".over-frame");
    return new Promise(function(resolve, reject){
        over_frame.style.display = 'block';
        let counter = 3;
        numb.textContent = counter;
        let interval = setInterval(()=>{
            if(counter == 0){
                clearInterval(interval);
                over_frame.style.display = 'none';
                resolve(true);
            }
            else{
                counter-=1;
                if(counter==0){
                    numb.textContent = '찰칵';
                }
                else numb.textContent = counter;
    
            }
        }, 1000)
    })
}

async function test(){
    for(var i = 0; i<10; i++){
        var check = await cnt_down();
        console.log(i, 'promise done');
    }
}

test();