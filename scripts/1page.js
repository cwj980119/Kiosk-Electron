const { ipcRenderer } = require('electron')

arg = ["원재"]

ipcRenderer.send('api_call',arg)