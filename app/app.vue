<script setup lang="ts">
// const colorMode = useColorMode()
// colorMode.preference = 'light'

const { locale } = useI18n()

const direction = computed(() => {
  return locale.value === 'ar' ? 'rtl' : 'ltr'
})

useHead(() => ({
  htmlAttrs: {
    dir: direction.value,
    lang: locale.value,
  },
}))
</script>
<template>
  <Html :dir="direction" :lang="locale">
    <Main>

    </Main>
    <Body>
      <UApp>
      <LayoutNavbar />
      <NuxtPage />
    </UApp>
    </Body>
  </Html>
</template>
