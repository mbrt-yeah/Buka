const { spawn } = require('child_process');
const watch = require('node-watch');
const electronServer = require('electron-connect').server.create();

const watch_dir = './dist';
const npm_command = /^win/.test(process.platform) ? 'npm.cmd' : 'npm';

function greeting() {
    console.log(`Begin watching files in ${watch_dir}`);
}

function startApp() {
    electronServer.start();
    /*const build = spawn(npm_command, ['run', 'build']);
    build.on('close', function () {
        electronServer.start();
    });*/
}

function startWatch() {
    watch(watch_dir, {
        recursive: true
    }, function (evt, name) {
        console.log("App updated, recompiling...");
        const build = spawn(npm_command, ['run', 'build']);
        build.on('close', function () {
            electronServer.reload();
        });
    });
}

electronServer.on('closed', function () {
    process.exit();
});

function start() {
    startApp();
    greeting();
    startWatch();
}

start();
