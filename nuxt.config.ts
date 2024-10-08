// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  ssr: false,
  devtools: { enabled: false },
  colorMode: { preference: 'light' },
  app: {
    baseURL: '/verse-closet/',
  },
  vite: {
    // `NUXT_` から始まる環境変数を読み込む
    envPrefix: 'NUXT',
  },
  runtimeConfig: {
    public: {
      dbName: 'VerseCloset',
      dbVersion: 1,
      // 以下は環境変数から読み込み
      brandNameList: String(import.meta.env.NUXT_BRAND_NAME_LIST || '').split(','),
      cardPoolList: String(import.meta.env.NUXT_CARD_POOL_LIST || '').split(','),
    },
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
  ],
  eslint: {
    config: {
      stylistic: true,
    },
  },
})
