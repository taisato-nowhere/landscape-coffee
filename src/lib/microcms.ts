// microCMS クライアント（ニュース / ジャーナル）。
// 環境変数 MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY が設定されていれば
// microCMS から取得し、無ければ src/contents/content.ts のモックにフォールバックする。
// → 鍵未設定でもビルドは通り、本番サイトは常に表示できる。
import { getSecret } from "astro:env/server";
import type { Locale } from "../text/ui";
import { news as localNews, journal as localJournal } from "../contents/content";

const domain = getSecret("MICROCMS_SERVICE_DOMAIN");
const apiKey = getSecret("MICROCMS_API_KEY");

/** microCMS に接続できる状態か（両方の鍵がある） */
export const microcmsEnabled = Boolean(domain && apiKey);

/** 画面側で扱う正規化済みの記事。thumbnailUrl はリモートURL（microCMS）。 */
export interface Article {
  slug: string;
  date: string; // YYYY.MM.DD
  category: string;
  title: Record<Locale, string>;
  body: Record<Locale, string>; // リッチエディタHTML（無ければ ""）
  thumbnailUrl: string | null; // microCMS画像URL。ローカル画像を使う場合は null
}

function fmtDate(v: string): string {
  if (!v) return "";
  const d = new Date(v);
  if (isNaN(d.getTime())) return v.slice(0, 10).replace(/-/g, ".");
  // microCMSの日付はUTC保存（日本時間0時=UTC前日15時）。JSTに直して YYYY.MM.DD。
  const jst = new Date(d.getTime() + 9 * 3600 * 1000);
  const y = jst.getUTCFullYear();
  const m = String(jst.getUTCMonth() + 1).padStart(2, "0");
  const day = String(jst.getUTCDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

/** microCMS のリスト型API（news / journal 共通スキーマ）を取得して正規化。 */
async function fetchList(endpoint: string): Promise<Article[]> {
  const res = await fetch(
    `https://${domain}.microcms.io/api/v1/${endpoint}?limit=100&orders=-date`,
    { headers: { "X-MICROCMS-API-KEY": apiKey as string } },
  );
  if (!res.ok) throw new Error(`microCMS ${endpoint} ${res.status}`);
  const data = (await res.json()) as { contents: any[] };
  return data.contents.map((c) => ({
    slug: c.id,
    date: c.date ? fmtDate(c.date) : fmtDate(c.publishedAt),
    category: Array.isArray(c.category) ? (c.category[0] ?? "") : (c.category ?? ""),
    title: { ja: c.title ?? "", en: c.titleEn || c.title || "" },
    body: { ja: c.body ?? "", en: c.bodyEn || c.body || "" },
    thumbnailUrl: c.thumbnail?.url ?? null,
  }));
}

type LocalItem = { slug: string; date: string; category: string; title: Record<Locale, string> };

function localToArticles(items: LocalItem[]): Article[] {
  return items.map((n) => ({
    slug: n.slug,
    date: n.date,
    category: n.category,
    title: { ...n.title },
    body: { ja: "", en: "" },
    thumbnailUrl: null, // ローカルは getImage(`<endpoint>/${slug}`) 側で解決
  }));
}

const cache: Record<string, Article[]> = {};

/** 汎用：エンドポイントの記事一覧（新しい順）。microCMS優先・失敗時はモック。 */
async function getList(endpoint: string, fallback: LocalItem[]): Promise<Article[]> {
  if (cache[endpoint]) return cache[endpoint];
  if (!microcmsEnabled) return (cache[endpoint] = localToArticles(fallback));
  try {
    return (cache[endpoint] = await fetchList(endpoint));
  } catch (e) {
    console.warn(`[microCMS] ${endpoint} 取得に失敗、モックにフォールバック:`, e);
    return (cache[endpoint] = localToArticles(fallback));
  }
}

/** ニュース一覧 */
export const getNews = () => getList("news", localNews);
/** ジャーナル一覧 */
export const getJournal = () => getList("journal", localJournal);

/** slug でニュース1件 */
export async function getNewsItem(slug: string): Promise<Article | null> {
  return (await getNews()).find((a) => a.slug === slug) ?? null;
}
/** slug でジャーナル1件 */
export async function getJournalItem(slug: string): Promise<Article | null> {
  return (await getJournal()).find((a) => a.slug === slug) ?? null;
}

/** microCMS画像URLに最適化パラメータを付与（リサイズ・webp化）。 */
export function cmsImage(url: string, w: number): string {
  return `${url}?fm=webp&w=${w}&q=80&fit=crop`;
}
