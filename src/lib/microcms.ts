// microCMS クライアント（ニュース）。
// 環境変数 MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY が設定されていれば
// microCMS から取得し、無ければ src/contents/content.ts のモックにフォールバックする。
// → 鍵未設定でもビルドは通り、本番サイトは常に表示できる。
import { getSecret } from "astro:env/server";
import type { Locale } from "../text/ui";
import { news as localNews } from "../contents/content";

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
  return (v ?? "").slice(0, 10).replace(/-/g, ".");
}

async function fetchNews(): Promise<Article[]> {
  const res = await fetch(
    `https://${domain}.microcms.io/api/v1/news?limit=100&orders=-date`,
    { headers: { "X-MICROCMS-API-KEY": apiKey as string } },
  );
  if (!res.ok) throw new Error(`microCMS news ${res.status}`);
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

function localToArticles(): Article[] {
  return localNews.map((n) => ({
    slug: n.slug,
    date: n.date,
    category: n.category,
    title: { ...n.title },
    body: { ja: "", en: "" },
    thumbnailUrl: null, // ローカルは getImage(`news/${slug}`) 側で解決
  }));
}

let cache: Article[] | null = null;

/** ニュース一覧（新しい順）。microCMS優先・失敗時はモック。 */
export async function getNews(): Promise<Article[]> {
  if (cache) return cache;
  if (!microcmsEnabled) return (cache = localToArticles());
  try {
    return (cache = await fetchNews());
  } catch (e) {
    console.warn("[microCMS] ニュース取得に失敗、モックにフォールバック:", e);
    return (cache = localToArticles());
  }
}

/** slug（microCMSのコンテンツID）で1件取得。 */
export async function getNewsItem(slug: string): Promise<Article | null> {
  const all = await getNews();
  return all.find((a) => a.slug === slug) ?? null;
}

/** microCMS画像URLに最適化パラメータを付与（リサイズ・webp化）。 */
export function cmsImage(url: string, w: number): string {
  return `${url}?fm=webp&w=${w}&q=80&fit=crop`;
}
