# microCMS 連携手順（ニュース）

ニュースを「ブラウザの管理画面から本文付きで投稿」できるようにする設定。
サイト側の配線は完了済み（`src/lib/microcms.ts`）。**鍵が入るまではモック表示**なので、設定途中でも本番は壊れません。

## 役割分担
- **佐藤さん**: microCMS の無料アカウント作成 → API（news）を下記スキーマで作成 → 鍵を共有
- **こちら（Claude）**: 鍵を GitHub Secrets / `.env` に登録 → 本番ビルド確認 → Webhook（自動再ビルド）設定

---

## 1. アカウントとサービス作成
1. https://microcms.io/ で無料登録（Hobbyプラン）
2. 「サービス」を新規作成（サービスIDは任意。例 `landscape-coffee`）
   - このとき URL が `https://landscape-coffee.microcms.io` のようになる。`landscape-coffee` の部分が **サービスドメイン**

## 2. API「news」を作成
- API を新規作成 → **エンドポイント名: `news`** → **型: リスト形式**
- 「APIスキーマ」で以下のフィールドを**このフィールドIDのとおり**に追加（表示名は自由）:

| フィールドID | 種類 | 必須 | 備考 |
|---|---|---|---|
| `title` | テキストフィールド | ✓ | 日本語タイトル |
| `titleEn` | テキストフィールド | | 英語タイトル（任意） |
| `category` | セレクトフィールド | ✓ | 選択肢に `NEW STORE` / `MEDIA` / `PROJECT`（複数選択オフ推奨） |
| `date` | 日付 | ✓ | 表示する日付 |
| `thumbnail` | 画像 | | サムネ（任意） |
| `body` | リッチエディタ | | 本文（日本語） |
| `bodyEn` | リッチエディタ | | 本文（英語・任意） |

> 記事の **コンテンツID** がそのまま URL（`/news/<コンテンツID>`）になります。記事作成時に
> 読みやすいID（例 `summer-blend-2025`）を付けてください。

## 3. テスト記事を1件作成して「公開」

## 4. APIキーを確認
- 「サービス設定 → APIキー」。デフォルトキーで **GET（読み取り）権限**があればOK。

## 5. 鍵を共有 → こちらで有効化
共有してもらうもの:
- **サービスドメイン**（例 `landscape-coffee`）
- **APIキー**

こちらで実施:
- GitHub: リポジトリ Settings → Secrets and variables → Actions に
  `MICROCMS_SERVICE_DOMAIN` と `MICROCMS_API_KEY` を登録
- ローカル `.env` にも同値を入れて本番ビルドで実データ表示を確認 → 反映

## 6.（任意）公開時に自動再ビルド（Webhook）
microCMSで記事を公開/更新したら自動でサイト更新する設定。
- GitHub の Personal Access Token（repo権限）を発行
- microCMS の API設定 → Webhook →「カスタム通知」で
  `POST https://api.github.com/repos/taisato-nowhere/landscape-coffee/dispatches`
  ヘッダ `Authorization: token <PAT>`、ボディ `{"event_type":"microcms-publish"}`
- これで公開ボタン → 数分でサイト反映（手動push不要）

> 6 が未設定でも、こちらが push すれば反映されます。まずは 1〜5 でOK。
