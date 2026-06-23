// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://landscapecoffee.jp',
  i18n: {
    defaultLocale: 'ja',
    locales: ['ja', 'en'],
    routing: {
      // 既定言語(ja)は接頭辞なし(`/`)、英語は`/en/`
      prefixDefaultLocale: false,
    },
  },
});
