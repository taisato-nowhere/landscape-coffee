// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages（プロジェクトサイト）用。独自ドメイン確定後に差し替え。
  site: 'https://taisato-nowhere.github.io',
  base: '/landscape-coffee',
  i18n: {
    defaultLocale: 'ja',
    locales: ['ja', 'en'],
    routing: {
      // 既定言語(ja)は接頭辞なし(`/`)、英語は`/en/`
      prefixDefaultLocale: false,
    },
  },
});
