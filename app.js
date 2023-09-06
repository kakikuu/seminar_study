const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const path = require('path');
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
    console.log('uploadFileData', uploadFileData);
    savePath = __dirname + '/tmp/' + uploadFileData.name; //ファイルnameを取得して、保存先のパスを指定

    // 任意の場所にファイルを保存
    uploadFileData.mv(savePath, function (err) {
        if (err)
            return res.status(500).send(err);

        res.send('File uploaded!');
    });
});

// サーバーを立てる
// ファイルのアップロードの機能とは関係ない
let server = app.listen(port, function () {
    console.log("listening at port %s", server.address().port);
});

