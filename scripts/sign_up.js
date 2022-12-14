const { count } = require('console');
const { ipcRenderer } = require('electron')
const fs = require('fs')
require('dotenv').config();


var fullname;
var password;
var confirmpassword;
var phonenumber;
var gender;
var birthday;
var id = 9999; //중복 저장방지 큰 값
var image_num;
var train_num = 0;
var test_num = 0;
var genderer

var video = null;
var canvas = null;
var numb;
var over_frame;
var loader;

var user_table = process.env.DB_USER_TABLE;

var cap_message =['정면을 바라봐 주세요',
                '왼쪽을 바라봐주세요',
                '오른쪽을 바라봐주세요',
                '위를 바라봐 주세요',
                '아래를 바라봐 주세요',
                '웃어주세요',
                '아~',
                '에~',
                '이~',
                '오~',
                '우~']

function page_loading(){
    var sql = 'select count(*) as num from '+ user_table
    db_result = ipcRenderer.sendSync('DB_call', sql)
    id = db_result[0].num;
}

window.onload = async function(){
    loading_on();
    await wait(1);
    page_loading();
    numb = document.querySelector(".numb");
    canvas = document.getElementById('canvas');
    document.querySelector('.btn-signup').addEventListener('click',function(){
        fullname = document.getElementById('fullname').value;
        password = document.getElementById('password').value;
        confirmpassword = document.getElementById('confirmpassword').value;
        birthday = document.getElementById('birthday').value;
        phonenumber = document.getElementById('phonenumber').value;
        gender = genderer;
        console.log(fullname,password,birthday, gender,phonenumber);
        if(fullname!="" && password!="" &&birthday!="" && phonenumber!="" && gender>0){
            if(password == confirmpassword && password!=""){
                console.log(document.getElementById('camname').innerText);
                document.getElementById('camname').innerText = fullname +' 님';
                document.querySelector('.upper-frame').style.transform = 'translate(0, -90vh)'
                if(birthday == '') birthday = '2023';
                cam_on();
            }
            else {
                new Notification('비밀번호 확인', {body: '비밀번호가 일치하지 않습니다.'});
                console.log('비밀번호가 일치하지 않습니다.')
            }
        }
        else{
            new Notification('입력오류', {body: '모든 정보를 입력해주세요.'});
        }
    })

    document.querySelector('.cam-back').addEventListener('click',function(){
        document.querySelector('.upper-frame').style.transform = 'translate(0, 0vh)'
    })

    loading_off();
    over_frame.style.display = 'none';
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
    return new Promise(async function(resolve, reject){
        canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 600;
        context.translate(this.canvas.width,0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0, 800 , 600);
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

function loading_on(){
    numb = document.querySelector(".numb");
    over_frame = document.querySelector(".over-frame");
    loader = document.querySelector(".loader");
    over_frame.style.display = 'block';
    numb.style.display = 'none';
    loader.style.display = 'block';
    console.log('loading')
}

function loading_off(){
    loader.style.display = 'none';
    numb.style.display = 'block';
}
    

function cnt_down(){
    return new Promise(function(resolve, reject){
        over_frame.style.display = 'block';
        numb.style.display = 'block';
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
                    //numb.textContent = '확인중';
                    loading_on();
                }
                else numb.textContent = counter;
    
            }
        }, 1000)
    })
}

async function take_pic(){
    var picture_arr = [];
    test_num = train_num = 0;
    A = phonenumber;
    for(image_num = 0; image_num < 11; image_num++){
        over_frame.style.display = 'block';
        numb.style.display = 'block';
        numb.textContent = cap_message[image_num];
        await wait(3);
        var check = await cnt_down();
        filePath = await capture();
        var result = ipcRenderer.sendSync('api_call', filePath, 'image/check.jpg','faceCheck');
        loading_off();
        if(result == 'err'){
            image_num--;
            continue;
        }
        var number = JSON.parse(result)
        if(number.result == 0){
            numb.textContent = '확인불가';
            image_num--;
        }
        else if(number.result ==1){
            numb.textContent = '촬영완료'
            if(image_num == 0 || image_num == 4 || image_num == 7){ //test 데이터
                s3Path = 'signup/dataset/test/' + id + '/' + test_num +'.jpg';
                test_num++;
            }
            else{
                s3Path = 'signup/dataset/train/' + id + '/' + train_num +'.jpg';
                train_num++;
            }
            filePath = await image_save(canvas)
            picture_arr[image_num] = s3Path;
            ipcRenderer.send('api_call', filePath, s3Path, null)
            //over_frame.style.display = 'none'
        }
        else{
            numb.textContent = '1명보다 많은 얼굴이 보입니다'
            image_num--;
        }
        await wait(1);
    }
    numb.textContent = '쵤영이 완료되었습니다'
    await wait(3);
    over_frame.style.display = 'none';
    console.log(phonenumber)
    console.log(A)
    ipcRenderer.send('sign_up', picture_arr ,id ,fullname, password, birthday, gender, phonenumber);
    localStorage.setItem('age',2023 - Number(birthday.substr(0,4)));
    localStorage.setItem('name', fullname.substr(0,1) + '*' + fullname.substr(2));
    localStorage.setItem('gender',gender);
    localStorage.setItem('DB', false);
    location.href='../pages/menu.html';
}

function wait(sec){
    return new Promise((resolve, reject) => {
        setTimeout(function() {
            resolve();
          }, sec * 1000);
    })
}

//page_loading()

// ipcRenderer.on('api_call_result', async (event, result)=>{
//     console.log('api call result')
//     loader.style.display = 'none';
//     numb.style.display = 'block';
//     var number = JSON.parse(result)
//     if(number.result == 0){
//         numb.textContent = '확인불가';
//         image_num--;
//     }
//     else if(number.result ==1){
//         filePath = await image_save(canvas)
//         s3Path = 'signup/' + id + '/' + image_num +'.jpg';
//         ipcRenderer.send('api_call', filePath, s3Path, null)
//         over_frame.style.display = 'none'
//     }
//     else{
//         numb.textContent = '1명보다 많은 얼굴이 보입니다'
//         image_num--;
//     }
// })