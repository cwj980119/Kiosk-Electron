var video = null;
var canvas = null;
var re;
const fs = require('fs')
const { ipcRenderer } = require('electron');
const { BlockList } = require('net');
require('dotenv').config();

var user_table = process.env.DB_USER_TABLE;
var menu_table = process.env.DB_MENU_TABLE;
var db = process.env.DB_DATABASE

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
        //new Notification('캡쳐 완료', {body: '캡쳐가 완료되었습니다.'});
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

function id_window_on(){
    win = document.getElementById('id-check')
    win.style.opacity = 1;
}

async function test(){
    cam_on();
    while(1){
        await wait(3);
        console.log(window.innerWidth)
        ratio = window.innerWidth/window.innerHeight;
        filePath = await capture(ratio)
        result = ipcRenderer.sendSync('api_call', filePath, 'image/check.jpg','faceCheck');
        if(result == 'err') return
        number = JSON.parse(result)
        if(number.result == 1){
            filePath = await image_save(canvas)
            predict = ipcRenderer.sendSync('api_call', filePath, 'image/check.jpg','login');
            p = JSON.parse(predict)
            console.log(p)
            set_name(p);        
            id_window_on()
            break;
        }
        else{
            console.log('인식 오류')
        }
    }
    //await capture();
}

function set_name(p){
    document.getElementById('name0').innerText = p[0]['name'].substr(0,1) + '*' + p[0]['name'].substr(2);
    document.getElementById('name1').innerText = p[1]['name'].substr(0,1) + '*' + p[1]['name'].substr(2);
    document.getElementById('name2').innerText = p[2]['name'].substr(0,1) + '*' + p[2]['name'].substr(2);
    document.getElementById('name3').innerText = p[3]['name'].substr(0,1) + '*' + p[3]['name'].substr(2);
    document.getElementById('number0').innerText = p[0]['Date'];
    document.getElementById('number1').innerText = p[1]['Date'];
    document.getElementById('number2').innerText = p[2]['Date'];
    document.getElementById('number3').innerText = p[3]['Date'];
}

function to_menu(i){
    localStorage.setItem('name',p[i]['name'].substr(0,1) + '*' + p[i]['name'].substr(2));
    age = 2022 - Number(p[i]['year']) +1;
    localStorage.setItem('age',age);
    localStorage.setItem('gender',p[i]['gender']);
    location.href='../pages/menu.html';
}

function find_my_id(){
    document.getElementById('id-check').style.opacity = 0;
    document.getElementById('find-id-frame').style.display= 'block';
}

function search(){
    numb = document.getElementById('phonenumb').value;
    ol = document.getElementById("id-list");
    ol.innerHTML = '';
    if(numb.length == 4){
        re = ipcRenderer.sendSync('DB_call', "select memberID, name, date_format(birthdate, '%m%d') as date, date_format(birthdate, '%Y') as year, gender, train, test from "+ user_table +" where phonenumber like '%" + numb +"' order by name")
        cnt = re.length;
        if(cnt==0){
            new_name = document.createElement("div");
            new_name.innerHTML = '<div>조회결과가 없습니다.</div>'
            ol.appendChild(new_name);
        }
        else{
            for(let i = 0; i<cnt; i++){
                a_name = re[i]['name'];
                _name = a_name.substr(0,1) + '*' + a_name.substr(2);
                _birth = re[i]['date'];
                new_name = document.createElement("div");
                new_name.innerHTML = '<div class="id-info"><div class = "id-num">'+ i +'</div><div class = "id-name">'+ _name +'</div><div class="id-birth">'+_birth+'</div> <button class ="id-ok" onclick="addData(this.parentElement)">확인</button> </div>'
                ol.appendChild(new_name);
            }
        }
    }
    console.log('age = ' + Number(2022 - Number(re[0]['year'])))
}

async function addData(el){
    var element = el;
    idx = el.querySelector('.id-num').innerHTML;
    if(re[idx]['train']/re[idx]['test'] > 3){
        s3Path = 'signup/dataset/test/' + String(Number(re[idx]['memberID'])-1) + '/' + re[idx]['test'] +'.jpg';
        console.log(s3Path);
        column = 'test';
    } 
    else{
        s3Path = 'signup/dataset/train/' + String(Number(re[idx]['memberID'])-1) + '/' + re[idx]['train'] +'.jpg';
        console.log(s3Path);
        column = 'train';
    }
    age = 2022 - Number(re[idx]['year']) +1;
    filePath = await image_save(canvas);
    ipcRenderer.send('api_call', filePath, s3Path, 'addface');
    ipcRenderer.sendSync('DB_call',"update "+user_table+" set " + column+" =  "+column+" +1 where memberID = "+String(Number(re[idx]['memberID'])))
    localStorage.setItem('name', re[idx]['name']);
    localStorage.setItem('age', age);
    localStorage.setItem('gender', re[idx]['gender']);
    location.href='../pages/menu.html';
}

window.onload = function(){
    //cam_on();
    localStorage.setItem('name', '게스트');
    localStorage.setItem('age', 0);
    console.log(ipcRenderer.sendSync('flask_call', 'age_gender',null));
    test();

}