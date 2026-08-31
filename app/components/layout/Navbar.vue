<script setup lang="ts">
import { CheckSquare, Globe, Sun, Moon } from '@lucide/vue'

const { locale, setLocale } = useI18n()
const colorMode = useColorMode()

async function toggleLocale() {
  await setLocale(locale.value === 'en' ? 'ar' : 'en')
}

function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b border-app-border bg-app-surface/80 backdrop-blur-md transition-colors duration-200">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
      <!-- Brand Logo -->
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-md shadow-indigo-500/20 text-white">
          <CheckSquare class="h-5 w-5" />
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-xl font-bold tracking-tight text-app-text">
            Task<span class="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">flow</span>
          </span>
          <span class="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-500 dark:bg-indigo-400/10 dark:text-indigo-400">
            PRO
          </span>
        </div>
      </div>

      <!-- Action Controls -->
      <div class="flex items-center gap-3">
        <!-- Language Switcher Pill -->
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg border border-app-border bg-app-surface px-3 py-1.5 text-xs font-semibold text-app-text transition-all hover:bg-app-surface-hover hover:border-indigo-500/30"
          @click="toggleLocale"
        >
          <Globe class="h-3.5 w-3.5 text-app-muted" />
          <span>{{ locale === 'en' ? $t('arabic') : $t('english') }}</span>
        </button>

        <!-- Color Mode Toggle -->
        <button
          type="button"
          aria-label="Toggle theme"
          class="flex h-9 w-9 items-center justify-center rounded-lg border border-app-border bg-app-surface text-app-muted transition-all hover:border-indigo-500/30 hover:text-indigo-500"
          @click="toggleColorMode"
        >
          <Sun  class="h-4 w-4 text-amber-400 dark:block hidden " />
          <Moon class="h-4 w-4 text-indigo-600 dark:hidden" />
        </button>

        <!-- Add Task Modal CTA Button -->
        <TasksAddTaskModal />
      </div>
    </div>
  </header>
</template>

