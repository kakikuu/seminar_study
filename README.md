# ファイルのアップロード

### ファイルのアップロードするコードを書く前にすること
- index.html(フロントエンド)とapp.js(サーバーサイド) を作る
- app.jsの中に以下のコードを書く
    - サーバーを立てて、HTMLファイルを表示できるようにする
    - ```javascript
        const express = require('express');
        const app = express();
        const path = require('path');
        const port = 3000;
        // ミドルウェアの設定
        app.use(express.static(path.join(__dirname, 'public')));
        // ルート: フォームページを表示
        app.get('/', function (req, res) {
        const indexPath = path.join(__dirname, './index.html');
        res.sendFile(indexPath);
       });
    
          // サーバーを起動
        const server = app.listen(port, function () {
        console.log(`サーバーがポート ${server.address().port} で起動しました。`);
        });
      ```

### コード解説
#### ファイルの役割
`app.js`
- サーバーサイド
    - サーバーを立てる
    - HTMLファイルを表示する
    - アップロードされたファイルを受け取る
        - ```javascript
          app.use(fileUpload({tempFileDir: '/tmp/'}));
          let uploadFileData; //アップロードされたファイルデータを格納するための変数
          let savePath; //アップロードされたファイルを保存するためのパスを指定する変数
    
          if (!req.files || Object.keys(req.files).length === 0) {
              return res.status(400).send('No files were uploaded.');
            }
    
          uploadFileData = req.files.uploadFileData; // ファイルデータを格納 ・ req.files.sampleFileのsampleFileはinputタグのname属性の値
          console.log('uploadFileData', uploadFileData);
          savePath = __dirname + '/tmp/' + uploadFileData.name; //ファイルnameを取得して、保存先のパスを指定
          ```
    - アップロードされたファイルを保存する
        - ```
            uploadFileData.mv(savePath, function (err) {
            if (err)
                return res.status(500).send(err);
    
            res.send('File uploaded!');
            });    
          ```    

`index.html`
- フロントエンド
    - ファイルをアップロードするフォームの作成
        - app.jsで受け取ってくれる処理をしてくれる場所(エンドポイント)にアップロードするように設定
        - ```HTML
          <form ref='uploadForm' id='uploadForm' action='http://localhost:3000/upload' method='post' encType="multipart/form-data">
            <input type="file" name="uploadFileData" />
            <input type='submit' value='Upload!' />
          </form>
            ```
        - 今回の場合だとエンドポイントは`/upload`
 
### 参考文献
`express.js`：ファイルアップロード
- https://www.npmjs.com/package/express-fileupload
- https://github.com/richardgirges/express-fileupload/tree/master/example#basic-file-upload

