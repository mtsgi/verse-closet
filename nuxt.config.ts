import packageJson from './package.json'

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
        { property: 'og:image', content: 'https://mtsgi.github.io/verse-closet/banner.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Verse Closet' },
        { property: 'twitter:description', content: 'コーデアイテムかんりツール「Verse Closet」' },
        { property: 'og:image', content: 'https://mtsgi.github.io/verse-closet/banner.png' },
        { name: 'thumbnail', content: 'https://mtsgi.github.io/verse-closet/banner.png' },
      ],
      link: [
        { rel: 'icon', href: './favicon.ico' },
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
      appVersion: packageJson.version,
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
          src: 'android/android-launchericon-512-512.png',
          sizes: '512x512',
          purpose: 'maskable',
        },
        {
          src: 'android/android-launchericon-192-192.png',
          sizes: '192x192',
          purpose: 'maskable',
        },
        {
          src: 'android/android-launchericon-144-144.png',
          sizes: '144x144',
          purpose: 'maskable',
        },
        {
          src: 'android/android-launchericon-96-96.png',
          sizes: '96x96',
          purpose: 'maskable',
        },
        {
          src: 'android/android-launchericon-72-72.png',
          sizes: '72x72',
          purpose: 'maskable',
        },
        {
          src: 'android/android-launchericon-48-48.png',
          sizes: '48x48',
          purpose: 'maskable',
        },
        {
          src: 'ios/16.png',
          sizes: '16x16',
        },
        {
          src: 'ios/20.png',
          sizes: '20x20',
        },
        {
          src: 'ios/29.png',
          sizes: '29x29',
        },
        {
          src: 'ios/32.png',
          sizes: '32x32',
        },
        {
          src: 'ios/40.png',
          sizes: '40x40',
        },
        {
          src: 'ios/50.png',
          sizes: '50x50',
        },
        {
          src: 'ios/57.png',
          sizes: '57x57',
        },
        {
          src: 'ios/58.png',
          sizes: '58x58',
        },
        {
          src: 'ios/60.png',
          sizes: '60x60',
        },
        {
          src: 'ios/64.png',
          sizes: '64x64',
        },
        {
          src: 'ios/72.png',
          sizes: '72x72',
        },
        {
          src: 'ios/76.png',
          sizes: '76x76',
        },
        {
          src: 'ios/80.png',
          sizes: '80x80',
        },
        {
          src: 'ios/87.png',
          sizes: '87x87',
        },
        {
          src: 'ios/100.png',
          sizes: '100x100',
        },
        {
          src: 'ios/114.png',
          sizes: '114x114',
        },
        {
          src: 'ios/120.png',
          sizes: '120x120',
        },
        {
          src: 'ios/128.png',
          sizes: '128x128',
        },
        {
          src: 'ios/144.png',
          sizes: '144x144',
        },
        {
          src: 'ios/152.png',
          sizes: '152x152',
        },
        {
          src: 'ios/167.png',
          sizes: '167x167',
        },
        {
          src: 'ios/180.png',
          sizes: '180x180',
        },
        {
          src: 'ios/192.png',
          sizes: '192x192',
        },
        {
          src: 'ios/256.png',
          sizes: '256x256',
        },
        {
          src: 'ios/512.png',
          sizes: '512x512',
        },
        {
          src: 'ios/1024.png',
          sizes: '1024x1024',
        },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    devOptions: { enabled: true },
  },
})
