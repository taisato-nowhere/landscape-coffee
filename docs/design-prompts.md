# GPT デザインイメージ生成プロンプト（工程#2）

最終更新: 2026-06-11
用途: GPT等の画像生成で、LANDSCAPE COFFEE サイトのデザインイメージ（カンプ）を作るためのプロンプト集。
土台: `docs/screen-spec.md` §0 トーン指針。

## 使い方のコツ
- **参照画像を添付**すると精度が上がる: Berth Coffee（https://backpackersjapan.co.jp/berthcoffee/）のスクショや、事業計画書の古民家内装イメージ、年輪ロゴ。
- 生成画像内の**文字は崩れて出るのが普通**。文字は「雰囲気」として見て、レイアウト・配色・写真の使い方・余白を評価する。
- 1枚に全部詰め込むと崩れやすい。**「ヒーロー」「TOP全体」「店舗詳細」をそれぞれ生成**するとよい。
- 縦長フルページは破綻しやすいので、まずはファーストビュー（16:9 か 3:2）から。
- 画像モデルは英語の方が安定することがある。日本語版・英語版の両方を用意。

---

## 0. アートディレクション（共通の世界観・最初に1枚）

### 日本語
```
スペシャルティコーヒーブランド「LANDSCAPE COFFEE」のアートディレクション用ムードボード。
コンセプトは「思い出の交差点」。古民家を改装した、木の温もりある空間。
露出した木の梁、自然光、土壁・漆喰、木のカウンター、棚に並ぶコーヒー豆の袋。
ロゴは木の「年輪」をモチーフにした手描きの円。一番外の円はあえて閉じていない（禅の円相）。
配色は生成り／オフホワイトの背景、墨色（ほぼ黒）の文字、コーヒーを思わせる温かいブラウンのアクセント。低彩度で自然。
雰囲気は、編集的・静か・上質・温かい。雑誌のような余白。写真主役。
高品質、リアル、シネマティックな自然光。
```

### English
```
A mood board for the art direction of a Japanese specialty coffee brand "LANDSCAPE COFFEE".
Concept: "a crossroads of memories". A renovated old Japanese house (kominka) full of warm wood.
Exposed wooden ceiling beams, natural daylight, plaster/earthen walls, a wooden counter,
shelves lined with bags of coffee beans.
Logo motif: a hand-drawn tree-ring circle; the outermost ring is intentionally left open (zen ensō).
Palette: cream / off-white background, near-black charcoal text, warm coffee-brown accents. Low saturation, natural.
Mood: editorial, calm, refined, warm. Magazine-like whitespace. Photography-led.
High quality, realistic, cinematic natural light.
```

---

## 1. TOP ページ（デスクトップ・フルページのカンプ）

### 日本語
```
スペシャルティコーヒーブランド「LANDSCAPE COFFEE」公式サイトのトップページのWebデザインカンプ（UIモックアップ）。デスクトップ表示、縦長1カラム。
トーン: 編集的で静か、余白たっぷり、写真主役。Berth Coffee のような落ち着いた編集デザイン。
配色: 生成り／オフホワイト背景、墨色のテキスト、温かいブラウンのアクセント。
タイポ: 日本語と英語の上品な混植。ロゴは年輪モチーフの手描き円。

上から下へのセクション構成:
1. ヘッダー（左にロゴ、右にナビ: ABOUT / STORES / ONLINE STORE / NEWS / CONTACT、JA/EN切替、カートアイコン）
2. ヒーロー（フルブリードの大きな写真＝古民家の店内 or コーヒーを淹れる手元。中央〜左に英語＋日本語のブランドコピー）
3. ブランドステートメント（短い詩的な日本語テキスト＋余白）
4. STORES（店舗カード4枚: 写真＋店名＋エリア。2枚は「Coming Soon」バッジ）
5. ONLINE STORE（コーヒー豆の商品ピックアップ4点、正方形写真＋名前＋価格）
6. NEWS（最新記事3〜6件、サムネ＋日付＋タイトル）
7. Instagram の写真グリッド
8. フッター（ロゴ、店舗リンク、SNS、特商法・プライバシー）

高品質、リアルなWeb UI、自然光のコーヒー写真。
```

### English
```
A web design comp (UI mockup) of the homepage for the specialty coffee brand "LANDSCAPE COFFEE". Desktop, single tall column.
Tone: editorial, calm, generous whitespace, photography-led — like Berth Coffee.
Colors: cream / off-white background, charcoal text, warm brown accents.
Typography: refined mix of Japanese and English. Logo is a hand-drawn tree-ring circle.

Sections top to bottom:
1. Header (logo left; nav right: ABOUT / STORES / ONLINE STORE / NEWS / CONTACT; JA/EN toggle; cart icon)
2. Hero (full-bleed large photo of a renovated old Japanese house cafe interior or hands brewing coffee; bilingual brand tagline)
3. Brand statement (short poetic Japanese text with whitespace)
4. STORES (4 store cards: photo + name + area; two cards have a "Coming Soon" badge)
5. ONLINE STORE (4 coffee bean products, square photos + name + price)
6. NEWS (3–6 latest posts, thumbnail + date + title)
7. Instagram photo grid
8. Footer (logo, store links, social, legal)

High quality, realistic web UI, natural-light coffee photography.
```

---

## 2. TOP ヒーロー（ファーストビューだけ・16:9）

### 日本語
```
「LANDSCAPE COFFEE」サイトのファーストビュー（ヒーロー）のWebデザイン。16:9、デスクトップ。
フルブリードの大きな写真: 古民家を改装した店内、木の梁と自然光、木のカウンター。
左上にミニマルなヘッダー（年輪ロゴ＋ナビ）。画面中央〜左に、英語の大きなブランドコピーと日本語の小さなサブコピー。
配色は生成り・墨色・温かいブラウン。編集的で静か、余白たっぷり。下にスクロール誘導。
高品質、シネマティックな自然光。
```

### English
```
The hero / first view of the "LANDSCAPE COFFEE" website. 16:9, desktop.
A full-bleed photo: interior of a renovated old Japanese house cafe, wooden beams and natural light, wooden counter.
A minimal header top-left (tree-ring logo + nav). Center-left: a large English brand tagline with a small Japanese subline.
Palette: cream, charcoal, warm brown. Editorial, calm, lots of whitespace. A subtle scroll-down indicator.
High quality, cinematic natural light.
```

---

## 3. 店舗詳細ページ（本宮07・デスクトップ）

### 日本語
```
「LANDSCAPE COFFEE 本宮07」の店舗詳細ページのWebデザインカンプ。デスクトップ、縦長1カラム。
トーン: 編集的・静か・写真主役・余白たっぷり。生成り背景、墨色テキスト、温かいブラウンのアクセント。

構成（上から）:
1. 店舗のヒーロー写真（古民家の外観 or 店内）＋店名「本宮07 / MOTOMIYA」とエリア「福島県本宮市」
2. 情報ブロック（営業時間・定休日、住所、電話、駐車場）を整然としたレイアウトで
3. 地図（埋め込み風）
4. メニュー（LUNCH / CAFE / BAR の3カテゴリ、写真と品名・価格）
5. 店舗写真ギャラリー（複数枚、余白のあるグリッド）
6. Instagram への導線
高品質、リアルなWeb UI、自然光の写真。
```

### English
```
A web design comp of the store detail page for "LANDSCAPE COFFEE Motomiya 07". Desktop, single tall column.
Tone: editorial, calm, photography-led, generous whitespace. Cream background, charcoal text, warm brown accents.

Structure (top to bottom):
1. Store hero photo (kominka exterior or interior) + store name "MOTOMIYA 07" and area "Motomiya, Fukushima"
2. Info block (hours/closed days, address, phone, parking) in a clean layout
3. An embedded-style map
4. Menu (three categories LUNCH / CAFE / BAR, with photos, item names and prices)
5. Store photo gallery (several images in an airy grid)
6. A link to Instagram
High quality, realistic web UI, natural-light photography.
```

---

## 4. モバイル版（任意・9:16）
上記いずれかのプロンプト末尾に「モバイル表示（スマホ縦画面、9:16、ハンバーガーメニュー）」を加える。
Append "mobile view (smartphone portrait, 9:16, hamburger menu)" to any prompt above.
```
```
