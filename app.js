const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const path = require('path');
const { PythonShell } = require('python-shell');
const port = 3000;
const baseUrl = `http://localhost:${port}`;
const fs = require('fs');

// ミドルウェアの設定
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload({
    tempFileDir: '/tmp/'
}));

// ルート: フォームページを表示
app.get('/', function (req, res) {
    const indexPath = path.join(__dirname, './view/index.html');
    res.sendFile(indexPath);
});

// ルート: ファイルのアップロードおよびPythonスクリプトの実行
app.post('/upload', function (req, res) {
    let uploadFileData; // アップロードされたファイルデータ
    let savePath; // アップロードされたファイルの保存先パス

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    uploadFileData = req.files.uploadFileData;
    savePath = path.join(__dirname, 'tmp', uploadFileData.name);

    uploadFileData.mv(savePath, function (err) {
        if (err) {
            return res.status(500).send(err);
        }

        // Pythonスクリプトの実行
        let shell = new PythonShell('imgclassification.py', { mode: 'text' });
        shell.send(savePath);

        let messageFromPython = "test"; // デフォルトのメッセージ。外側で定義することで.end内でも参照できるようになる

        // Pythonスクリプトからのメッセージを受け取る
        shell.on('message', function (message) {
            // ここで受け取る値は、python側でprintした値
            // shell.onの第一引数はmessageという名前で固定(他の名前に変えると動かない)
            messageFromPython = message;
            console.log(`node.js側のmessage: ${message}`);
        });

        shell.end(function (err) {
            if (err) throw err;
            console.log('Pythonのコードの実行が終了しました');

            // HTMLファイルを読み込んでプレースホルダを置き換えてクライアントに送信
            fs.readFile(path.join(__dirname, 'public', 'result.html'), 'utf8', function (err, data) {
                // HTMLのデータがdataに格納される
                if (err) {
                    console.error(err);
                    return res.status(500).send('エラーが発生しました。');
                }
                // result.html内にあるプレースホルダを変数で置き換え
                const modifiedHTML = data.replace('{{ messageFromPython }}', messageFromPython);
                // {{messageFromPython}}を置き換えたHTMLを返す
                res.send(modifiedHTML);
            });
        });
    });
});

// サーバーを起動
const server = app.listen(port, function () {
    console.log(`サーバーがポート ${server.address().port} で起動しました。`);
});

