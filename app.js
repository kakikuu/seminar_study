const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const path = require('path');
let { PythonShell } = require('python-shell')
const port = 3000;
const baseUrl = 'http://localhost:' + port;

// 静的ファイル（.htmlファイルなど）を提供するためのディレクトリを指定
app.use(express.static(path.join(__dirname, 'public')));

// default options
app.use(fileUpload({
    tempFileDir: '/tmp/'
}));


app.get('/', function (req, res) {
    // index.htmlを返す
    // index.htmlファイルへのパスを生成
    const indexPath = path.join(__dirname, './view/index.html');

    // index.htmlファイルを送信
    res.sendFile(indexPath);
});

app.post('/upload', function (req, res) {
    let uploadFileData; //アップロードされたファイルデータを格納するための変数
    let savePath; //アップロードされたファイルを保存するためのパスを指定する変数

    // リクエストされた際、ファイルがアップロードされていない場合はエラーを返す
    // !req.files → req.filesが存在しない場合にtrueを返す
    // Object.keys(req.files).length === 0 → req.filesの中身が空の場合にtrueを返す
    // 上２つの条件が || で繋がっている → またはの意味
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    uploadFileData = req.files.uploadFileData; // ファイルデータを格納 ・ req.files.sampleFileのsampleFileはinputタグのname属性の値

    savePath = __dirname + '/tmp/' + uploadFileData.name; //ファイルnameを取得して、保存先のパスを指定

    // 任意の場所にファイルを保存
    uploadFileData.mv(savePath, function (err) {
        if (err)
            // ファイルを保存する際にエラーが発生した場合はエラーを返す
            return res.status(500).send(err);

        // pythonshellを使ってpythonファイルを実行
        let shell = new PythonShell('imgclassification.py', { mode: 'text' });
        shell.send(savePath);

        // Check!!：shell.onの第一引数はmessageという名前で固定(他の名前に変えると動かない)
        shell.on('message', function (message) {
            // ここで受け取る値は、python側でprintした値
            console.log(`node.js側のmessage: ${message}`);
        });

        shell.end(function (err) {
            if (err) throw err;
            console.log('finished');
            res.send('File uploaded!');// 画面に表示される文字を返す
        });
    });
});

// サーバーを立てる
// ファイルのアップロードの機能とは関係ない
let server = app.listen(port, function () {
    console.log("listening at port %s", server.address().port);
});

