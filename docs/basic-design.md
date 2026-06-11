# LANDSCAPE COFFEE 基本設計書（Basic Design）

最終更新: 2026-06-11 / 対象: ヘッドレス構成のシステム全体設計。

---

## 1. アーキテクチャ概要

**ヘッドレス構成**: フロント（Astro）が、コンテンツ基盤（microCMS）とEC基盤（Shopify）をAPIで束ねる。重い領域（在庫・注文・決済・特商法）は外部SaaSに委譲し、自前実装を最小化する。

```
                ┌─────────────────────────────┐
                │   ブラウザ（PC / SP）        │
                └──────────────┬──────────────┘
                               │
                ┌──────────────▼──────────────┐
                │   Astro（フロント）          │  ← Claude Codeで実装
                │   - 静的ページ生成（SSG）     │
                │   - i18n ルーティング(ja/en)  │
                │   - カート等は島(Islands)で動的│
                └───┬───────────┬───────────┬──┘
       Content API  │           │Storefront │  Form/Email
        (GET)       │           │API(GraphQL)│
            ┌───────▼───┐  ┌────▼─────┐  ┌──▼──────────┐
            │ microCMS  │  │ Shopify  │  │ フォーム送信 │
            │ ニュース   │  │ 商品/在庫 │  │ + メール通知 │
            │ 店舗情報   │  │ 注文/決済 │  │ + スパム対策 │
            └───────────┘  └──────────┘  └─────────────┘
                                │
                         決済時はShopify
                         ホスト決済へ遷移
```

---

## 2. 技術スタック

| 層 | 採用 | 備考 |
|----|------|------|
| フロント | **Astro** | コンテンツ主役・多言語・高速表示。動的部分のみ Islands（React 等）|
| スタイル | （デザイン工程で確定）Tailwind 等を想定 | トーンは screen-spec §0 |
| CMS | **microCMS** | ニュース・店舗情報。日本語管理画面、スタッフ運用容易 |
| EC | **Shopify（ヘッドレス / Storefront API）** | 商品・カート自作、決済はShopifyホスト |
| 決済手段 | Shopify Payments ＋ KOMOJU 経由で PayPay/コンビニ 等 | カード約3.4%、PayPay等+1%前後 |
| フォーム | Astro APIルート ＋ メール送信（Resend 等）＋ Turnstile | §6 |
| ホスティング | **Vercel**（推奨）/ 代替: Cloudflare Pages, Netlify | Astro SSR/Islands対応・i18n容易。コスト最適化ならCloudflare |
| 解析 | （任意）GA4 / Plausible | |

> プラン目安（2026/06）: Shopify Basic 約¥4,850/月（年払 約¥3,650/月）＋ 決済手数料。microCMS は無料〜有料（コンテンツ量で選択）。ホスティングは無料枠で開始可能。

---

## 3. ルーティング / i18n 設計

- 既定言語=日本語（`/...`）、英語=`/en/...`。
- Astro の i18n ルーティングでロケール分岐。`hreflang` を出力。
- 言語切替は「同一ページの対応ロケール」へ遷移。未翻訳時は既定言語へフォールバック（ヘッダーで明示）。
- microCMS は **言語フィールド or 言語別コンテンツ** で多言語を表現（運用負荷を見て、店舗/ABOUT/CONTACTは英語必須、NEWS本文は日本語許容）。
- Shopify は言語/市場設定で表示言語を切替。

主要パス（JA / ENは`/en`接頭）:
`/`, `/about`, `/stores`, `/stores/[store]`, `/shop`, `/shop/[handle]`, `/cart`, `/news`, `/news/[slug]`, `/contact`, `/legal/tokushoho`, `/legal/privacy`

---

## 4. コンテンツモデル（microCMS）

### 4.1 店舗（stores）
| フィールド | 型 | 備考 |
|---|---|---|
| name | text | 店名（例: 本宮07）|
| slug | text | URL（例: motomiya）|
| area | text | 県市（例: 福島県本宮市）|
| status | select | `open` / `coming_soon` |
| address | text | 住所 |
| map | text/iframe | 地図埋め込み or 緯度経度 |
| hours | richtext | 営業時間・定休日 |
| tel | text | 電話 |
| parking | richtext | 駐車場情報 |
| menu | richtext / 画像 | LUNCH/CAFE/BAR |
| photos | media[] | ギャラリー |
| sns | text | Instagram 等 |
| lang | select | i18n運用方針による |

### 4.2 ニュース（news）
| フィールド | 型 | 備考 |
|---|---|---|
| title | text | |
| slug | text | |
| category | select | 出店情報 / コラボ / お知らせ |
| publishedAt | date | |
| thumbnail | media | OGP兼用 |
| body | richtext | |
| lang | select | |

### 4.3 ブランド/ABOUT（任意でmicroCMS化）
- v1は静的でも可。更新頻度が出れば microCMS 化。

---

## 5. EC（Shopify）設計

- **商品閲覧・カート**: Storefront API（GraphQL）で Astro 側に実装（P-05〜P-07）。
- **決済**: カート→Shopify ホストの Checkout へ遷移。独自ドメイン決済は Plus のみのため、v1はShopifyドメイン決済を許容。
- **在庫/注文/配送/特商法**: Shopify が保持。複数ロケーション在庫で将来のマルチ店舗在庫に対応可。
- **決済手段**: Shopify Payments（カード/Apple/Google Pay）＋ KOMOJU で PayPay・コンビニ等を追加。
- **定期便（将来）**: Subscriptionsアプリ（Mikawaya 等）で追加。スキーマ/UIは後付け可能な構成にしておく。
- **特商法/プライバシー**: 法務ページ（P-12）＋ Shopify ポリシー設定。

---

## 6. お問い合わせフォーム設計

- フロント: Astro のフォーム → APIルート（サーバーレス関数）で受信。
- 送信: メール通知（Resend 等のメールAPI）。送信先は運用メール（オープン課題）。
- スパム対策: **Cloudflare Turnstile**（or reCAPTCHA）必須。サーバー側バリデーション。
- 保存: v1はメール通知のみで足りる。必要なら microCMS/スプレッドシート等に記録（後付け）。
- 個人情報: プライバシーポリシー明記、最小限の取得。

---

## 7. 外部サービス連携まとめ

| サービス | 用途 | 認証/鍵 | 備考 |
|---|---|---|---|
| microCMS | ニュース・店舗 | APIキー（読み取り） | サーバー側で取得 |
| Shopify | 商品・カート・決済 | Storefront APIトークン | 公開トークンは権限最小化 |
| KOMOJU | 日本決済手段 | Shopify連携 | PayPay/コンビニ等 |
| メールAPI（Resend等） | フォーム通知 | APIキー（秘匿） | 環境変数 |
| Turnstile | スパム対策 | サイト/シークレットキー | |
| Instagram | TOP埋め込み | 公開埋め込み or Graph API | 方式は実装時判断 |
| Google Maps | 店舗地図 | 埋め込み | |

- **秘匿情報**は環境変数で管理（リポジトリにコミットしない）。公開可能な鍵（Storefront 公開トークン等）と秘匿鍵を区別。

---

## 8. 非機能・運用

- **パフォーマンス**: SSG中心＋画像最適化（Astro Image）。Islandで必要箇所のみJS。
- **SEO**: メタ/OGP/構造化データ（LocalBusiness, Article）。sitemap.xml / robots.txt。
- **アクセシビリティ**: 代替テキスト・コントラスト・キーボード操作。
- **解析**: GA4 or Plausible（任意）。
- **デプロイ**: Git連携の自動デプロイ。プレビュー環境（microCMSプレビュー連携）。
- **バックアップ/復旧**: コンテンツはSaaS側、コードはGit。

---

## 9. セキュリティ
- 秘匿鍵はサーバーサイド/環境変数のみ。クライアントに出さない。
- フォームのレート制限・CAPTCHA。
- 依存パッケージの定期更新。
- HTTPS強制。

---

## 10. オープン課題（PRD §8と同期）
- 独自ドメイン、ホスティング最終決定、フォーム送信先、各SaaSアカウント開設、英語翻訳体制。
