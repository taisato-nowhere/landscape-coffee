// モックコンテンツ（後で microCMS / Shopify のAPI取得に差し替える）。
// 多言語フィールドは { ja, en } で保持。
import type { Locale } from "../i18n/ui";

export type Localized = Record<Locale, string>;

export type StoreStatus = "open" | "coming_soon";

export interface Store {
  slug: string;
  /** 都道府県番号（ブランドの識別子。例: 香川=37, 福島=07, 岐阜=21）*/
  code: string;
  name: Localized; // 例: 本宮 / MOTOMIYA
  nameEn: string; // ローマ字表記（数字横の英字に使用）
  area: Localized; // 例: 福島県本宮市
  prefecture: Localized;
  role: Localized; // 例: Origin / Roastery
  status: StoreStatus;
  /** トップの OUR LANDSCAPES に巨大数字で出すか（叩き案は37/07/21の3つ）*/
  featured: boolean;
}

// ※ 坂出と高松はどちらも香川=37。番号システムの最終方針は要決定（PRD/設計の論点）。
export const stores: Store[] = [
  {
    slug: "sakaide",
    code: "37",
    name: { ja: "坂出", en: "Sakaide" },
    nameEn: "SAKAIDE",
    area: { ja: "香川県坂出市", en: "Sakaide, Kagawa" },
    prefecture: { ja: "香川", en: "Kagawa" },
    role: { ja: "Origin", en: "Origin" },
    status: "open",
    featured: true,
  },
  {
    slug: "motomiya",
    code: "07",
    name: { ja: "本宮", en: "Motomiya" },
    nameEn: "MOTOMIYA",
    area: { ja: "福島県本宮市", en: "Motomiya, Fukushima" },
    prefecture: { ja: "福島", en: "Fukushima" },
    role: { ja: "", en: "" },
    status: "open",
    featured: true,
  },
  {
    slug: "takayama",
    code: "21",
    name: { ja: "高山", en: "Takayama" },
    nameEn: "TAKAYAMA",
    area: { ja: "岐阜県高山市", en: "Takayama, Gifu" },
    prefecture: { ja: "岐阜", en: "Gifu" },
    role: { ja: "Roastery", en: "Roastery" },
    status: "coming_soon",
    featured: true,
  },
  {
    slug: "takamatsu",
    code: "37",
    name: { ja: "高松", en: "Takamatsu" },
    nameEn: "TAKAMATSU",
    area: { ja: "香川県高松市", en: "Takamatsu, Kagawa" },
    prefecture: { ja: "香川", en: "Kagawa" },
    role: { ja: "", en: "" },
    status: "coming_soon",
    featured: false,
  },
];

export type NewsCategory = "NEW STORE" | "MEDIA" | "PROJECT";

export interface NewsItem {
  slug: string;
  date: string; // YYYY.MM.DD
  category: NewsCategory;
  title: Localized;
}

export const news: NewsItem[] = [
  {
    slug: "open-motomiya-07",
    date: "2025.05.01",
    category: "NEW STORE",
    title: {
      ja: "LANDSCAPE COFFEE 07 福島・本宮にオープン",
      en: "LANDSCAPE COFFEE 07 opens in Motomiya, Fukushima",
    },
  },
  {
    slug: "media-brutus",
    date: "2025.04.18",
    category: "MEDIA",
    title: {
      ja: "雑誌「BRUTUS」に掲載されました",
      en: "Featured in BRUTUS magazine",
    },
  },
  {
    slug: "crowdfunding-report",
    date: "2025.05.28",
    category: "PROJECT",
    title: {
      ja: "クラウドファンディング 目標達成のご報告",
      en: "Crowdfunding goal achieved — a report",
    },
  },
];

export type JournalCategory = "PEOPLE" | "TOWN" | "COFFEE";

export interface JournalItem {
  slug: string;
  date: string;
  category: JournalCategory;
  title: Localized;
}

export const journal: JournalItem[] = [
  {
    slug: "people-01",
    date: "2025.05.01",
    category: "PEOPLE",
    title: {
      ja: "人との出会いから、景色は変わっていく。",
      en: "Through the people we meet, the landscape changes.",
    },
  },
  {
    slug: "town-01",
    date: "2025.04.18",
    category: "TOWN",
    title: {
      ja: "土地の文化は、静かに息づいている。",
      en: "The culture of a place quietly breathes.",
    },
  },
  {
    slug: "coffee-01",
    date: "2025.04.05",
    category: "COFFEE",
    title: {
      ja: "記憶は、未来の道しるべになる。",
      en: "Memory becomes a guidepost to the future.",
    },
  },
];

export interface Product {
  handle: string;
  name: Localized;
  weight: string;
  price: number; // 円
}

export const products: Product[] = [
  {
    handle: "landscape-blend",
    name: { ja: "LANDSCAPE BLEND", en: "LANDSCAPE BLEND" },
    weight: "200g",
    price: 1780,
  },
  {
    handle: "37-blend",
    name: { ja: "37 BLEND", en: "37 BLEND" },
    weight: "200g",
    price: 1780,
  },
  {
    handle: "07-blend",
    name: { ja: "07 BLEND", en: "07 BLEND" },
    weight: "200g",
    price: 1780,
  },
  {
    handle: "21-blend",
    name: { ja: "21 BLEND", en: "21 BLEND" },
    weight: "200g",
    price: 1980,
  },
];

export function yen(n: number): string {
  return "¥" + n.toLocaleString("ja-JP");
}
