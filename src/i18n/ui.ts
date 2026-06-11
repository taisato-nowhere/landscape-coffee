// UI文言（ロケール別）。コンテンツ本文(stores/news等)は src/data/content.ts 側で多言語化。
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
    "hero.title": "思い出の交差点",
    "hero.subtitle": "A Place Where Memories Meet.",
    "hero.scroll": "SCROLL",
    "brand.body":
      "Landscape は、景色だけではありません。\n人との出会い、街の記憶、土地の文化、未来への邂逅。\n私たちはそれらすべてを、Landscape と呼びます。",
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
    "hero.title": "A Crossroads of Memories",
    "hero.subtitle": "A Place Where Memories Meet.",
    "hero.scroll": "SCROLL",
    "brand.body":
      "Landscape is not only the scenery.\nIt is the people we meet, the memory of a town, the culture of a place, and the encounters yet to come.\nWe call all of it Landscape.",
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
