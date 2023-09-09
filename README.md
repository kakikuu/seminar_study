# seminar_study
## node.jsとpythonの連携
使用したフレームワーク：python-shell
- node.jsでpythonを簡単に使うことができる
- 正直、jsを触ったことが無いなら、python(FastAPIとかflaskとか)を利用してサーバーサイドを実装したほうが多分楽

### 利用したコード
`app.js`49行目
```javascript
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
```
簡単な説明
- send
    - python側にデータを渡す 
- on
    - pythonからのデータを受け取る
    - 具体的には、python内でのprintされたデータを受け取る
- end
    - pythonのコードが実行した際に処理が始まる

### 参考サイト
python-shell
- https://www.npmjs.com/package/python-shell 
