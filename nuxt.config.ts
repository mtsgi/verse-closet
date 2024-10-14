// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  ssr: false,
  devtools: { enabled: false },
  colorMode: { preference: 'light' },
  app: {
    baseURL: '/verse-closet/',
    head: {
      title: 'Verse Closet',
      meta: [
        { name: 'description', content: 'コーデアイテムかんりツール「Verse Closet」' },
        { property: 'og:title', content: 'Verse Closet' },
        { property: 'og:description', content: 'コーデアイテムかんりツール「Verse Closet」' },
        { property: 'og:image', content: 'icon.png' },
        { name: 'twitter:card', content: 'summary' },
      ],
    },
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
    '@vite-pwa/nuxt',
  ],
  eslint: {
    config: {
      stylistic: true,
    },
  },
  pwa: {
    strategies: 'generateSW',
    manifest: {
      id: 'verse-closet',
      scope: '/verse-closet/',
      name: 'Verse Closet',
      short_name: 'VerseCloset',
      description: 'コーデアイテムかんりツール「Verse Closet」',
      theme_color: '#ffcef8',
      icons: [
        {
          src: 'pwa-64x64.png',
          sizes: '64x64',
          type: 'image/png',
        },
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'maskable-icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    devOptions: { enabled: true },
  },
})
