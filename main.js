const menubar = require('menubar')
const electron = require('electron');
const path = require('path');
const ipc = electron.ipcMain;
const mb = menubar({ 
    transparent: true,
    icon: path.join(__dirname, String(1) + '.png'),
    height: 150,
    shadow: true
});

const setIcon = num => {
    mb.tray.setImage(path.join(__dirname, String(num) + '.png'));
};

ipc.on('pomodoroComplete', function(event, arg) {
    setIcon(1);
    mb.showWindow();
});

const timeouts = [];
ipc.on('timerBegin', function (e, id, time) {
    const start = Date.now();
    const quarter = time * 1000 / 4;
    timeouts.push(setTimeout(() => setIcon(2), quarter));
    timeouts.push(setTimeout(() => setIcon(3), quarter * 2));
    timeouts.push(setTimeout(() => setIcon(4), quarter * 3));
    timeouts.push(setTimeout(function () {
        e.sender.send('timerEnd', id);
    }, time * 1000));
});

ipc.on('timerCancel', function () {
    setIcon(1);
    timeouts.forEach(t => {
        clearTimeout(t);
    });
});
