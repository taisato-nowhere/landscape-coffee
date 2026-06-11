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
