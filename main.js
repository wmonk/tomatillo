const menubar = require('menubar')
const electron = require('electron');
const path = require('path');
const Menu = require('menu');
const ipc = electron.ipcMain;
const mb = menubar({ 
    transparent: true,
    icon: path.join(__dirname, 'icons', String(1) + '.png'),
    height: 150,
    shadow: true,
    'always-on-top': true
});

const setIcon = num => {
    mb.tray.setImage(path.join(__dirname, 'icons', String(num) + '.png'));
};

mb.on('after-create-window', function () {
    mb.window.openDevTools();
});

ipc.on('pomodoroComplete', function(event, arg) {
    setIcon(1);
    mb.showWindow();
});

const timeouts = [];
var animator = null;
ipc.on('timerBegin', function (e, id, time) {
    const start = Date.now();
    var anim = 1;
    animator = setInterval(() => {
        if (anim > 359) return;
        setIcon(anim++);
    }, time * 1000 / 359);
    timeouts.push(setTimeout(function () {
        e.sender.send('timerEnd', id);
    }, time * 1000));
});

ipc.on('timerCancel', function () {
    clearInterval(animator);
    setIcon(1);
    timeouts.forEach(t => {
        clearTimeout(t);
    });
});
