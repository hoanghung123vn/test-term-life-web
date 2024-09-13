let chokidar = require('chokidar');
let path = require('path');
let fs = require('fs');
let ready = false;
// watching scope: './src/pages'
let watcher = chokidar.watch(path.join(__dirname, './src/pages'), {
    ignored: /[\/\\]\./, persistent: true
});
let firstReady = true;

let log = console.log.bind(console);
let dataStr = '';

function catchCtList(_path) {
    let fileStr = fs.readFileSync(_path).toString('utf-8') || '';
    let data = fileStr.match(/(?<=( codeTableName='| codeTableName="))(.+?)(?=('|"))/g);
    let dataList = data ? data.toString().split(',') : [];
    dataList.length > 0 && dataList.forEach((item) => {
        let curItem = '"' + item + '"';
        dataStr = dataStr && dataStr.indexOf(curItem) > -1 ? dataStr : dataStr ? dataStr + ',"' + item + '"' : '"' + item + '"';
    })
    // log('CtList', '{"CtList":[' + dataStr + ']}');
    // eslint-disable-next-line no-undef
    const ctPath = path.join(__dirname, './src/config');
    fs.writeFileSync(path.join(ctPath, 'codeTableName.json'), '{"CtList":[' + dataStr + ']}', function () { });

}

// When the files in the src directory are modified, the codeTableName is automatically captured and synchronized to ./src/config/codeTableName.json
function changeListener(_path) {
    if (ready && !path.dirname(_path).endsWith('config')) {
        log('_path', _path);
        log('fileStr', fs.readFileSync(_path).toString('utf-8'));
        catchCtList(_path);
    }
}

function findAllPath(rootPath, pathList) {
    let files = fs.readdirSync(rootPath);
    files.forEach((item) => {
        let fsPath = path.join(rootPath, item);
        let fsState = fs.statSync(fsPath);
        if (fsState.isDirectory()) { findAllPath(fsPath, pathList); }
        if (fsState.isFile()) { pathList.push(fsPath); }
    })
}

function readyListener() {
    ready = true;
    if (firstReady) {
        let pathList = [];
        findAllPath(path.join(__dirname, './src/pages'), pathList);
        pathList.forEach((_path) => {
            catchCtList(_path);
        })
    }
    firstReady = false;
}


watcher
    .on('change', changeListener)
    .on('ready', readyListener);
