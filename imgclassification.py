import torch
import torchvision
from torchvision import models, transforms

from PIL import Image

import json


def main(filepath):
    # 学習済みモデルの読み込み
    vgg16_pretrained = torchvision.models.vgg16(pretrained=True)

    pil_img = Image.open(filepath)

    # resize_and_normalize_image_to_tensor内の正規化の際に3チャンネルが必要なため、RGBAの場合はRGBに変換する
    if pil_img.mode == 'RGBA':
        # RGBAは色に加えて不透明度がある
        pil_img = pil_img.convert('RGB')

    resize_and_normalize_image_to_tensor = transforms.Compose([
        # 画像リサイズ
        transforms.Resize(224),
        transforms.CenterCrop(224),
        # PIL.Imageからtorch.Tensorへの変換
        transforms.ToTensor(),
        # 正規化
        # RGBの3チャンネルを渡す必要がある
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225]
        )
    ])

    tensor_img = resize_and_normalize_image_to_tensor(pil_img)

    img_batch = tensor_img[None]

    # 推論モードに変更する
    vgg16_pretrained.eval()

    result = vgg16_pretrained(img_batch)
    idx = torch.argmax(result[0])

    # ラベルデータの読み込み
    with open('./imagenet_class_index.json') as f:
        labels = json.load(f)
        result_label = labels[str(idx.item())][1]
    print(f"分類結果は{result_label}")
    return result_label

label = main("./tmp/saboten.png")
print(label)