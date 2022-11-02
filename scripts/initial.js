const { ipcRenderer } = require('electron')

window.onload = function(){
    document.querySelector('.advertise').addEventListener('click',function(){
        document.querySelector('.advertise').style.transform = 'translate(0, -100vh)'
    })
}