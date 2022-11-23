const { ipcRenderer } = require('electron')

window.onload = function(){
    document.querySelector('.advertise').addEventListener('click',async function(){
        document.querySelector('.advertise').style.transform = 'translate(0, -100vh)'
        await wait(12);
        document.querySelector('.advertise').style.transform = 'translate(0, 0vh)'
    })
}

function wait(sec){
    return new Promise((resolve, reject) => {
        setTimeout(function() {
            resolve();
          }, sec * 1000);
    })
}