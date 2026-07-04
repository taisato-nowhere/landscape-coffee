// UI文言（ロケール別）。コンテンツ本文(stores/news等)は src/contents/content.ts 側で多言語化。
export type Locale = "ja" | "en";

export const locales: Locale[] = ["ja", "en"];
export const defaultLocale: Locale = "ja";

export const ui = {
  ja: {
    "nav.about": "ABOUT",
    "nav.stores": "STORES",
    "nav.shop": "ONLINE STORE",
    "nav.news": "NEWS",
    "nav.journal": "JOURNAL",
    "nav.contact": "CONTACT",
    "nav.cart": "CART",
    "hero.title": "LANDSCAPE COFFEE",
    "hero.subtitle": "Memories, ring by ring.",
    "hero.scroll": "SCROLL",
    "brand.body":
      "LANDSCAPE COFFEE は、香川県坂出市から始まったスペシャルティコーヒーのブランドです。\nコーヒーそのものだけでなく、店に集まる人、街の記憶、土地の文化、その先に生まれる時間までを大切にしています。\n福島・本宮、岐阜・高山、香川・高松へ。訪れる人の日常に、思い出として残る景色を少しずつ重ねていきます。",
    "brand.more": "ABOUT LANDSCAPE",
    "landscapes.title": "OUR LANDSCAPES",
    "landscapes.more": "VIEW ALL",
    "news.title": "NEWS",
    "news.more": "VIEW ALL",
    "journal.title": "JOURNAL",
    "journal.more": "VIEW ALL",
    "shop.title": "ONLINE STORE",
    "shop.more": "VIEW ALL PRODUCTS",
    "status.open": "OPEN",
    "status.coming": "COMING SOON",
    "footer.tagline": "スペシャルティコーヒーを、日常に。",
  },
  en: {
    "nav.about": "ABOUT",
    "nav.stores": "STORES",
    "nav.shop": "ONLINE STORE",
    "nav.news": "NEWS",
    "nav.journal": "JOURNAL",
    "nav.contact": "CONTACT",
    "nav.cart": "CART",
    "hero.title": "LANDSCAPE COFFEE",
    "hero.subtitle": "Memories, ring by ring.",
    "hero.scroll": "SCROLL",
    "brand.body":
      "LANDSCAPE COFFEE is a specialty coffee brand that began in Sakaide, Kagawa.\nBeyond the coffee itself, we care about the people who gather, the memories of each town, the culture of each place, and the time that grows from there.\nFrom Motomiya in Fukushima to Takayama in Gifu and Takamatsu in Kagawa, we are slowly layering landscapes that remain in everyday memory.",
    "brand.more": "ABOUT LANDSCAPE",
    "landscapes.title": "OUR LANDSCAPES",
    "landscapes.more": "VIEW ALL",
    "news.title": "NEWS",
    "news.more": "VIEW ALL",
    "journal.title": "JOURNAL",
    "journal.more": "VIEW ALL",
    "shop.title": "ONLINE STORE",
    "shop.more": "VIEW ALL PRODUCTS",
    "status.open": "OPEN",
    "status.coming": "COMING SOON",
    "footer.tagline": "Specialty coffee, into everyday life.",
  },
} as const;

export type UIKey = keyof (typeof ui)["ja"];

/** 指定ロケールの翻訳関数を返す。未定義キーは既定言語へフォールバック。 */
export function useTranslations(locale: Locale) {
  return function t(key: UIKey): string {
    return ui[locale][key] ?? ui[defaultLocale][key];
  };
}

/** base(サブパス配信)を前置。GitHub Pages の `/landscape-coffee/` 等に対応。 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const clean = path.startsWith("/") ? path : `/${path}`;
  return base + clean || "/";
}

/** パスにロケール接頭辞(ja=なし/en=/en)＋baseを付与。 */
export function localizedPath(path: string, locale: Locale): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  const localized =
    locale === defaultLocale ? clean : `/${locale}${clean === "/" ? "" : clean}`;
  return withBase(localized);
}
