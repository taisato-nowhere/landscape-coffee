# LANDSCAPE COFFEE — 実装規約（Claude Code / Codex 共通）

> このファイルと `CLAUDE.md` は同一内容を保つこと。一方を更新したら必ずもう一方にも反映する。

## プロジェクト概要
LANDSCAPE COFFEE（スペシャルティコーヒーのブランド）公式サイト。ヘッドレス構成で実装する。
- フロント: **Astro**（コンテンツ主役・多言語・高速。動的部分のみ Islands）
- CMS: **microCMS**（ニュース・店舗情報）
- EC: **Shopify ヘッドレス**（Storefront API。決済はShopifyホストへ遷移）
- 多言語: 日本語（既定）/ 英語（`/en`）

要件・設計の正本:
- `docs/PRD.md`（要件）
- `docs/screen-spec.md`（画面・デザイントーン）
- `docs/basic-design.md`（構成・連携・データモデル）
- `plans/PLANS.md`（工程）

## ブランド・トーン（実装にも効く）
- 世界観: 「思い出の交差点」/ 年輪 / landscape（景色＋記憶＋未来）。
- 古民家・木・手描き・温かさ ＋ 芯のある強さ。写真主役・余白・静かなモーション。
- 参考: Berth Coffee。

## コーディング規約
- TypeScript を使用。明示的な型を優先。
- コンポーネントは小さく、責務を分離。`src/components`, `src/layouts`, `src/pages`, `src/lib`(API クライアント) を基本構成とする。
- スタイルはデザイン工程で確定したトークン（色・余白・タイポ）に従う。マジックナンバーを散らさない。
- 既存のパターン・命名・コメント密度に合わせる。周囲のコードと馴染むコードを書く。
- アクセシビリティ: 代替テキスト、コントラスト、キーボード操作を担保。

## i18n
- ルーティングは Astro の i18n（既定=ja、en=`/en`）。`hreflang` を出力。
- 文言はロケール別に管理。未翻訳は既定言語へフォールバックし、その旨を明示。
- 優先英語化: TOP / ABOUT / STORES / CONTACT。NEWS本文は日本語許容（運用判断）。

## データ取得
- **microCMS**: サーバーサイド（ビルド時/SSR）で取得。読み取りAPIキーは環境変数。`src/lib/microcms.ts` に集約。
- **Shopify**: Storefront API（GraphQL）。公開トークンは権限最小。`src/lib/shopify.ts` に集約。クエリは型付け。
- 商品閲覧・カートは自作。決済（チェックアウト）はShopifyホストへ遷移させる。

## フォーム（CONTACT）
- 送信は Astro APIルート（サーバーレス）経由。メール通知（Resend 等）。
- **Cloudflare Turnstile（or reCAPTCHA）必須**。サーバー側で再検証＋バリデーション＋レート制限。

## セキュリティ・秘匿情報
- 秘匿鍵（メールAPI・Shopify管理系・Turnstileシークレット）は環境変数のみ。リポジトリにコミットしない。
- 公開可能な鍵（Storefront 公開トークン）と秘匿鍵を明確に区別。
- HTTPS強制。依存パッケージは定期更新。

## SEO / パフォーマンス
- SSG中心。画像は Astro Image で最適化、遅延読み込み。
- メタ/OGP、構造化データ（店舗=LocalBusiness、記事=Article）、sitemap.xml / robots.txt。
- 不要なJSを入れない（Islandは必要箇所のみ）。

## 店舗の Coming Soon
- 店舗は microCMS の `status`（`open` / `coming_soon`）で出し分け。
- 高山・高松は当面 `coming_soon`。未確定情報を表示しない。

## 作業の進め方
- 変更前に対象を確認し、PRD/screen-spec/basic-design と矛盾しないかチェック。
- 大きな仕様判断が必要な場合は、勝手に広げず確認する。
- テストや動作確認の結果は正直に報告する。

## やらないこと（v1スコープ外）
- オンライン予約 / 採用ページ / グッズEC / 定期便 / 多通貨 / 会員機能。
  （定期便・グッズは将来 Shopify 側で追加可能な構造を壊さない範囲で考慮）
