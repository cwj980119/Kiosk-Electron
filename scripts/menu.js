var total_price = 0;

window.onload = async function(){
    var value = localStorage.getItem('name');
    var age = localStorage.getItem('age');
    var gender = localStorage.getItem('gender');
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
    sum_price(price)
}

function addMenu(menu, price){
    ol = document.getElementById("order-list");
    new_menu = document.createElement("div");
    new_menu.innerHTML = '<div class="ordered-menu"> <div class="ordered-menu-name" id = "ordered-menu-name">'+menu+'</div> <div class="ordered-menu-count">1</div> <div class="ordered-menu-price"><a class="price">'+price+'</a>원</div> <div class="ordered-menu-cancle" onclick="delete_menu(this.parentElement)">삭제</div> </div>'
    ol.appendChild(new_menu);
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