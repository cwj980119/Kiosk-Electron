const { app, BrowserWindow } = require('electron')
const {ipcMain} = require('electron')
const url = require('url')
const request = require('request')

ipcMain.on('api_call' ,(event, argument) => {
  console.log('api call')
  var t = require("./scripts/s3_conn.js")
  t.upload(argument, ()=>{console.log(1)});
  // const options = {
  //   uri: "http://127.0.0.1:5000/home/${}"
  // }
  
  // r = request(options,function(err,reponse,body){
  //   console.log(body.lang)
  // })
})

ipcMain.on('s3_upload', (event, argument) => {

})

ipcMain.on('sign_up',(event, argument)=>{
  
  
})


const createWindow = () => {
    const win = new BrowserWindow({
      width: 800, //1600
      height: 1280, //2560
      //fullscreen : true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
      // frame: false //Remove Frame
    })
    
    //win.removeMenu()
    //win.webContents.openDevTools();
    console.log('hi')
    win.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow()
})

app.on('window-all-closed', () => {
  app.quit()
})

