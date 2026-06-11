# 画像の入れ方

このフォルダに画像ファイルを置くと、ファイル名（キー）に対応する場所へ自動で表示されます。
置かなければ自動でプレースホルダになります（崩れません）。形式は jpg / png / webp。

## ファイル名のルール（このとおりに置くだけ）

| 置く場所・ファイル名 | 使われる場所 | 推奨サイズ・比率 |
|---|---|---|
| `hero/main.jpg` | トップのヒーロー（一番上の大画像） | 横長 16:9、長辺 2000px 程度 |
| `stores/sakaide.jpg` | 店舗カード（坂出 37） | 16:10、長辺 1600px |
| `stores/motomiya.jpg` | 店舗カード（本宮 07） | 同上 |
| `stores/takayama.jpg` | 店舗カード（高山 21） | 同上 |
| `stores/takamatsu.jpg` | 店舗カード（高松） | 同上 |
| `products/landscape-blend.jpg` | 商品（LANDSCAPE BLEND） | 正方形 1:1、1200px |
| `products/37-blend.jpg` | 商品（37 BLEND） | 同上 |
| `products/07-blend.jpg` | 商品（07 BLEND） | 同上 |
| `products/21-blend.jpg` | 商品（21 BLEND） | 同上 |
| `journal/people-01.jpg` | JOURNAL（PEOPLE） | 16:9、1600px |
| `journal/town-01.jpg` | JOURNAL（TOWN） | 同上 |
| `journal/coffee-01.jpg` | JOURNAL（COFFEE） | 同上 |
| `news/<記事slug>.jpg` | NEWS サムネ（任意） | 16:9 |

- 拡張子は jpg / png / webp どれでもOK（例: `hero/main.png` でも可）。
- フォルダ（hero / stores / products / journal）が無ければ作ってください。
- Astro が自動で軽量化・リサイズします。元画像は大きめでOK。
