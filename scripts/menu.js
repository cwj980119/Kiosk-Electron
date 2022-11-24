var total_price = 0;
const { ipcRenderer } = require('electron');
var menu_table = process.env.DB_MENU_TABLE;

var value
var age
var gender
var db
var drinkdish
var maindish
var sidedish
var column
var order_list

window.onload = async function(){
    order_list = [];
    document.getElementById('username').innerText = value +' 님 환영합니다!';
    if(age == 0){
        //total
        document.getElementById('reco-menu').innerText = '우리매장 추천메뉴';
    }
    else if(age < 20){
        if(gender == 1){
            document.getElementById('reco-menu').innerText = '10대 남성 추천메뉴';
        }
        else{
            document.getElementById('reco-menu').innerText = '10대 여성 추천메뉴';
        }
    }
    else if(age < 30){
        if(gender == 1){
            document.getElementById('reco-menu').innerText = '20대 남성 추천메뉴';
        }
        else{
            document.getElementById('reco-menu').innerText = '20대 여성 추천메뉴';
        }
    }
    else if(age < 40){
        if(gender == 1){
            document.getElementById('reco-menu').innerText = '30대 남성 추천메뉴';
        }
        else{
            document.getElementById('reco-menu').innerText = '30대 여성 추천메뉴';
        }
    }
    else if(age < 50){
        if(gender == 1){
            document.getElementById('reco-menu').innerText = '40대 남성 추천메뉴';

        }
        else{
            document.getElementById('reco-menu').innerText = '40대 여성 추천메뉴';
        }
    }
    else{
        if(gender == 1){
            document.getElementById('reco-menu').innerText = '50대 남성 추천메뉴';
        }
        else{
            document.getElementById('reco-menu').innerText = '50대 여성 추천메뉴';
        }
    }

    document.getElementById("reco-main-img").src = "../src/"+maindish['menuname']+".jpg"
    document.getElementById("reco-main").innerHTML = maindish['menuname']+"<br>"
    document.getElementById("reco-main-price").innerHTML = maindish['price']

    document.getElementById("reco-side-img").src = "../src/"+sidedish['menuname']+".jpg"
    document.getElementById("reco-side").innerHTML = sidedish['menuname']+"<br>"
    document.getElementById("reco-side-price").innerHTML = sidedish['price']

    document.getElementById("reco-drink-img").src = "../src/"+drinkdish['menuname']+".jpg"
    document.getElementById("reco-drink").innerHTML = drinkdish['menuname']+"<br>"
    document.getElementById("reco-drink-price").innerHTML = drinkdish['price']

    await wait(300);
    location.href='../pages/initial.html';
}


function page_loading(){
    value = localStorage.getItem('name');
    age = localStorage.getItem('age');
    gender = localStorage.getItem('gender');
    db = localStorage.getItem('DB');
    if(age == 0){
        //total
        column = 'total'
    }
    else if(age < 20){
        if(gender == 1){
            column = '0m'
        }
        else{
            column = '0f'
        }
    }
    else if(age < 30){
        if(gender == 1){
            column = '20m'
        }
        else{
            column = '20f'
        }
    }
    else if(age < 40){
        if(gender == 1){
            column = '30m'
        }
        else{
            column = '30f'
        }
    }
    else if(age < 50){
        if(gender == 1){
            column = '40m'

        }
        else{
            column = '30f'
        }
    }
    else{
        if(gender == 1){
            column = '50m'
        }
        else{
            column = '50f'
        }
    }
    recommend=ipcRenderer.sendSync('DB_call',"select menuID, menuname, price from `log-in`.menu as d where "+ column +" = (select max("+ column +") from `log-in`."+menu_table +" as f where f.category = d.category) group by category")
    console.log(recommend)
    drinkdish = recommend[0]
    maindish = recommend[1]
    sidedish = recommend[2]
}
function test(){
    document.querySelector('.menu-list').style.transform = 'translate(0, 0vh)'
}

function goToScroll(name) {
    var location = document.querySelector("#" + name).offsetTop;
    document.querySelector('.menu-list-frame').scrollTo({top: location, behavior: 'smooth'});
}

function addMenuReco(main_name, price){
    ol = document.getElementById("order-list");
    new_menu = document.createElement("div");
    new_menu.innerHTML = '<div class="ordered-menu"> <div class="ordered-menu-name" id = "ordered-menu-name">'+main_name+'</div> <div class="ordered-menu-count">1</div> <div class="ordered-menu-price"><a class="price">'+price+'</a>원</div> <div class="ordered-menu-cancle" onclick="delete_menu(this.parentElement)">삭제</div> </div>'
    ol.appendChild(new_menu);
    order_list[order_list.length] = main_name;
    console.log(order_list)
    sum_price(price)
}

function addMenu(menu, price){
    ol = document.getElementById("order-list");
    new_menu = document.createElement("div");
    new_menu.innerHTML = '<div class="ordered-menu"> <div class="ordered-menu-name" id = "ordered-menu-name">'+menu+'</div> <div class="ordered-menu-count">1</div> <div class="ordered-menu-price"><a class="price">'+price+'</a>원</div> <div class="ordered-menu-cancle" onclick="delete_menu(this.parentElement)">삭제</div> </div>'
    ol.appendChild(new_menu);
    order_list[order_list.length] = menu;
    console.log(order_list)
    sum_price(price)
}

function sum_price(price){
    total_price+=Number(price);
    document.getElementById('total').innerText ='총금액 : ' +total_price+ '원';

}

function minus_price(price){
    total_price-=Number(price);
    document.getElementById('total').innerText ='총금액 : ' +total_price+ '원';
}

function delete_menu(el){
    var element = el;
    price = el.querySelector('.ordered-menu-price .price').innerHTML
    me = el.querySelector('.ordered-menu-name').innerHTML;
    for(let i = 0; i < order_list.length; i++) {
        if(order_list[i] == me) {
          order_list.splice(i, 1);
          break;
        }
    }
    console.log(order_list)
    minus_price(price);
    element.remove();
}

function cancle(){
    ol = document.getElementById("order-list");
    total_price = 0;
    document.getElementById('total').innerText ='총금액 : ' +total_price+ '원';
    ol.innerHTML = '';
}

function order(){
    over_frame = document.querySelector(".over-frame");
    over_frame.style.display = 'block';
}

function order_cancle(){
    over_frame = document.querySelector(".over-frame");
    over_frame.style.display = 'none';
}

function wait(sec){
    return new Promise((resolve, reject) => {
        setTimeout(function() {
            resolve();
          }, sec * 1000);
    })
}

page_loading()