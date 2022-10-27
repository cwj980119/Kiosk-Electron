const { app, BrowserWindow } = require('electron')
const {ipcMain} = require('electron')
const url = require('url')
const request = require('request')
const mysql = require('mysql')
require('dotenv').config();

ipcMain.on('api_call' ,async (event, img, s3_loc, api_name) => {
  console.log('api call')
  var t = require("./scripts/s3_conn.js")
  await t.upload(img, s3_loc, api_name)
  .then((value)=>{
    result = value;
    console.log('1', result);
  })
  .catch(()=>{
    result = 'err';
  })
  event.returnValue = result;
})

ipcMain.on('DB_call', async (event, sql) => {
  var result = await DB(sql);
  event.returnValue = result;
})

ipcMain.on('s3_upload', (event, argument) => {

})

ipcMain.on('sign_up',(event, argument)=>{
  

})

ipcMain.on('faceCheck',async (event, argument)=>{
  console.log('fc')
  var img = argument;
  console.log(img)
  var temp = require("./scripts/s3_conn.js");
  await temp.check(img)
;})


const createWindow = () => {
    const win = new BrowserWindow({
      width: 800, //1600
      height: 1280, //2560
      //fullscreen : true,
      minWidth: 600,
      minHeight: 960,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
      // frame: false //Remove Frame
    })
    
    //win.removeMenu()
    //win.webContents.openDevTools();
    console.log('hi')
    //win.loadFile('./pages/main.html')
    win.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow()
})

app.on('window-all-closed', () => {
  app.quit()
})

function DB(sql){
  return new Promise((resolve, reject) => {
    var connection = mysql.createConnection({
        host     : process.env.DB_HOST,
        user     : process.env.DB_USERNAME,
        password : process.env.DB_PASSWORD,
        database : process.env.DB_DATABASE,
    });
    connection.connect();
    connection.query( sql, function (error, results, fields) {
        if (error) throw error;
        console.log(results);
        resolve(results)
    });
  
    connection.end();
  })
}