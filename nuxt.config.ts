// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  ssr: false,
  devtools: { enabled: false },
  colorMode: { preference: 'light' },
  app: {
    baseURL: '/verse-closet/',
  },
  runtimeConfig: {
    public: {
      dbName: 'VerseCloset',
      dbVersion: 1,
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
