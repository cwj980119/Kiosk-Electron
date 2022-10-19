var fullname;
var password;
var confirmpassword;
var phonenumber;
var gender;
var birthday;

var video = null;
var canvas = null;

window.onload = function(){
    document.querySelector('.btn-signup').addEventListener('click',function(){
        fullname = document.getElementById('fullname').value;
        password = document.getElementById('password').value;
        confirmpassword = document.getElementById('confirmpassword').value;
        birthday = document.getElementById('birthday').value;
        if(password == confirmpassword && password!=""){
            console.log(password);
            document.querySelector('.upper-frame').style.transform = 'translate(0, -90vh)'
        }
        else {
            console.log('비밀번호가 일치하지 않습니다.')
        }
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

cam_on();