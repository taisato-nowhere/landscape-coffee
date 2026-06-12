// microCMS クライアント（ニュース / ジャーナル）。
// 環境変数 MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY が設定されていれば
// microCMS から取得し、無ければ src/contents/content.ts のモックにフォールバックする。
// → 鍵未設定でもビルドは通り、本番サイトは常に表示できる。
import { getSecret } from "astro:env/server";
import type { Locale } from "../text/ui";
import {
  news as localNews,
  journal as localJournal,
  stores as localStores,
} from "../contents/content";

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

// ---------------------------------------------------------------------------
// 店舗（stores）
// ---------------------------------------------------------------------------

export type StoreMotif = "sea" | "town" | "mountain";

/** 画面側で扱う正規化済みの店舗。 */
export interface StoreEntry {
  slug: string;
  code: string;
  nameEn: string;
  name: Record<Locale, string>;
  area: Record<Locale, string>;
  role: Record<Locale, string>;
  status: "open" | "coming_soon";
  featured: boolean;
  order: number;
  motif: StoreMotif | null;
  thumbnailUrl: string | null;
  hours: string;
  address: Record<Locale, string>;
  tel: string;
  parking: Record<Locale, string>;
  body: Record<Locale, string>;
}

function normMotif(v: unknown): StoreMotif | null {
  const s = Array.isArray(v) ? v[0] : v;
  return s === "sea" || s === "town" || s === "mountain" ? s : null;
}

// slug からの既定モチーフ（CMS未指定時のフォールバック）
const motifBySlug: Record<string, StoreMotif> = {
  sakaide: "sea",
  takamatsu: "sea",
  motomiya: "town",
  takayama: "mountain",
};

// モック時の店舗詳細（CMS未接続の間だけ使う暫定値）
const localStoreDetails: Record<
  string,
  { hours: string; address: Record<Locale, string>; tel: string; parking: Record<Locale, string> }
> = {
  sakaide: {
    hours: "11:00–19:00 / 月曜定休",
    address: { ja: "香川県坂出市（詳細は準備中）", en: "Sakaide, Kagawa (details coming)" },
    tel: "—",
    parking: { ja: "近隣駐車場あり", en: "Nearby parking available" },
  },
  motomiya: {
    hours: "11:00–19:00（夜営業：金・土）/ 定休日準備中",
    address: { ja: "福島県本宮市・JR本宮駅徒歩1分", en: "1 min from JR Motomiya Sta., Fukushima" },
    tel: "—",
    parking: { ja: "店舗駐車場3台＋本宮駅前無料駐車場", en: "3 spaces + free station parking" },
  },
};

async function fetchStores(): Promise<StoreEntry[]> {
  const res = await fetch(
    `https://${domain}.microcms.io/api/v1/stores?limit=100&orders=order`,
    { headers: { "X-MICROCMS-API-KEY": apiKey as string } },
  );
  if (!res.ok) throw new Error(`microCMS stores ${res.status}`);
  const data = (await res.json()) as { contents: any[] };
  return data.contents.map((c) => {
    const st = Array.isArray(c.status) ? c.status[0] : c.status;
    return {
      slug: c.id,
      code: c.code ?? "",
      nameEn: c.nameEn ?? "",
      name: { ja: c.nameJa || c.nameEn || "", en: c.nameEn || "" },
      area: { ja: c.areaJa ?? "", en: c.areaEn || c.areaJa || "" },
      role: { ja: c.role ?? "", en: c.role ?? "" },
      status: st === "coming_soon" ? "coming_soon" : "open",
      featured: Boolean(c.featured),
      order: typeof c.order === "number" ? c.order : 9999,
      motif: normMotif(c.motif) ?? motifBySlug[c.id] ?? null,
      thumbnailUrl: c.thumbnail?.url ?? null,
      hours: c.hours ?? "",
      address: { ja: c.addressJa ?? "", en: c.addressEn || c.addressJa || "" },
      tel: c.tel ?? "",
      parking: { ja: c.parkingJa ?? "", en: c.parkingEn || c.parkingJa || "" },
      body: { ja: c.body ?? "", en: c.bodyEn || c.body || "" },
    } satisfies StoreEntry;
  });
}

function localToStores(): StoreEntry[] {
  return localStores.map((s, i) => {
    const d = localStoreDetails[s.slug];
    return {
      slug: s.slug,
      code: s.code,
      nameEn: s.nameEn,
      name: { ...s.name },
      area: { ...s.area },
      role: { ...s.role },
      status: s.status,
      featured: s.featured,
      order: i,
      motif: motifBySlug[s.slug] ?? null,
      thumbnailUrl: null,
      hours: d?.hours ?? "",
      address: d?.address ?? { ja: "", en: "" },
      tel: d?.tel ?? "",
      parking: d?.parking ?? { ja: "", en: "" },
      body: { ja: "", en: "" },
    } satisfies StoreEntry;
  });
}

let storesCache: StoreEntry[] | null = null;

/** 店舗一覧（order昇順）。microCMS優先・失敗時はモック。 */
export async function getStores(): Promise<StoreEntry[]> {
  if (storesCache) return storesCache;
  if (!microcmsEnabled) return (storesCache = localToStores());
  try {
    return (storesCache = await fetchStores());
  } catch (e) {
    console.warn("[microCMS] stores 取得に失敗、モックにフォールバック:", e);
    return (storesCache = localToStores());
  }
}

/** slug で店舗1件 */
export async function getStoreItem(slug: string): Promise<StoreEntry | null> {
  return (await getStores()).find((s) => s.slug === slug) ?? null;
}
