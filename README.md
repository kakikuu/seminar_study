# seminar_study
## 画像分類部分の実装
### 環境構築
1. 仮想環境を作成
2. 仮想環境をactiveにする
3. `pip install -r requirements.txt`を実行する

### コード解説
`imgclassification.py`： 画像のファイルパスを指定することで、画像分類を行う
- モデルはvgg16を使用 (学習済みモデルをコード内でダウンロードするので、別途ダウンロードは不要)
- `imagenet_class_index.json`
    - クラス名が書かれたラベルとモデルから出力されるindex番号を一致させるためのデータが必要
    - `imagenet_class_index.json`が`imgclassification.py`と同じ階層にあるかを確認
 
### 参考サイト
- 画像分類の処理
    - https://note.nkmk.me/python-pytorch-pretrained-models-image-classification/
    - https://github.com/raghakot/keras-vis/blob/master/resources/imagenet_class_index.json
