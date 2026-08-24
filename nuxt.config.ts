// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/i18n', '@pinia/nuxt', '@nuxt/ui', '@nuxtjs/color-mode'],
  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
  },
  i18n: {
    langDir: '../app/i18n/locals',
    locales: [
      {
        code: 'en',
        name: 'English',
        language: 'en-US',
        file: 'en.json',
        dir: 'ltr',
      },
      {
        code: 'ar',
        name: 'العربية',
        language: 'ar-EG',
        file: 'ar.json',
        dir: 'rtl',
      },
    ],

    defaultLocale: 'en',

    strategy: 'prefix_except_default',
  },
  runtimeConfig: {
    public: {
      BASE_URL: process.env.BASE_URL
    }
  }
})