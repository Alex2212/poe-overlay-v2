const { app, BrowserWindow, ipcMain,screen,dialog  } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
  width: 1000,
  maxWidth: 1500,
  height: 800,
  resizable: true,
  hasShadow: false,
  // fullscreenable: false,
  // transparent: true,
  frame: false,
  // skipTaskbar: true,
  // focusable: false,
  alwaysOnTop: true,
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    nodeIntegration: false,
    contextIsolation: true,
    webviewTag: true // Required to enable <webview>


  },
});

  win.loadFile('filter.html');

  ipcMain.on('move', (event, pos)=>{
  console.log(pos.x,pos.y);
  console.log('move',event,pos.x,pos.y);
  if (win) {
    if (typeof pos.x !== 'number' || typeof pos.y !== 'number') {
      console.error('Invalid delta values for move-window:', { pos});
      return;
    }
    const [currentX, currentY] = win.getPosition();
    win.setPosition(currentX + pos.x,currentY + pos.y);
    } else {
    console.error('Window instance not found.');
    }
});
}





ipcMain.on('close', ()=>{
  BrowserWindow.getFocusedWindow().close();
});


app.commandLine.appendSwitch('high-dpi-support', 'true');

app.commandLine.appendSwitch('force-device-scale-factor', '1');

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();


});