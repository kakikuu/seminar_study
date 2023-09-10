# seminar_study
## pythonから受け取ったデータをHTMLで表示する

### コード解説
`result.html`
```HTML
<p>処理結果: {{ messageFromPython }}</p>
```
- HTML上に変数を表示する箇所を予め用意しておく

`app.js`
```javascript
   // result.html内にあるプレースホルダを変数で置き換え
   const modifiedHTML = data.replace('{{ messageFromPython }}', messageFromPython);
   // {{messageFromPython}}を置き換えたHTMLを返す
   res.send(modifiedHTML);
```

### ひとこと
今回は情報量があまり増えないように使わなかったけど、.ejsという拡張子がある。
このファイルを使うことで変数をHTMLに入れやすくなる。詳しく知りたい人は、
`node.js テンプレートエンジン`で検索してみてください。
