var total_price = 0;

window.onload = function(){
    var value = localStorage.getItem('name');
    document.getElementById('username').innerText = value +' 님 환영합니다!';
    var blogs = [1, 2, 3];
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