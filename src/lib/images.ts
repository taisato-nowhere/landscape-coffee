// 画像レゾルバ：src/assets/images/ 配下の画像を「キー」で解決する。
// 例) getImage("stores/motomiya") → src/assets/images/stores/motomiya.jpg があれば返す。
// ファイルが無ければ null（呼び出し側はプレースホルダにフォールバック）。
import type { ImageMetadata } from "astro";

const files = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/images/**/*.{jpg,jpeg,png,webp,avif}",
  { eager: true },
);

const byKey = new Map<string, ImageMetadata>();
for (const path in files) {
  const m = path.match(/images\/(.+)\.(?:jpg|jpeg|png|webp|avif)$/i);
  if (m) byKey.set(m[1], files[path].default);
}

/** キー（拡張子なしの相対パス）で画像を取得。無ければ null。 */
export function getImage(key: string): ImageMetadata | null {
  return byKey.get(key) ?? null;
}

/**
 * フォルダ（プレフィックス）配下の画像をまとめて取得。
 * 例) getImages("hero") → hero/ 配下の全画像。
 * 並び順: "main" を最優先、それ以外はファイル名の昇順（02,03,…）。
 * ヒーローのスライドはこれを使うので、`hero/06.jpg` を置くだけで増やせる。
 */
export function getImages(prefix: string): ImageMetadata[] {
  const p = prefix.replace(/\/$/, "") + "/";
  return [...byKey.keys()]
    .filter((k) => k.startsWith(p))
    .sort((a, b) => {
      const aMain = a.endsWith("/main");
      const bMain = b.endsWith("/main");
      if (aMain !== bMain) return aMain ? -1 : 1;
      return a.localeCompare(b, undefined, { numeric: true });
    })
    .map((k) => byKey.get(k)!);
}
