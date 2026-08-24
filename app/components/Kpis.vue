<script setup lang="ts">
import { LayoutGrid, Clock, Sparkles, CheckCircle2 } from '@lucide/vue'

const tasksstore = useTaskStore()
const taskFilters = useTaskFiltersStore()

function normalizeStatus(status: string) {
  return status.trim().toLowerCase()
}

const cards = computed(() => [
  {
    title: 'All Tasks',
    status: 'all',
    count: tasksstore.tasks.length,
    icon: LayoutGrid,
    colorClass: 'text-indigo-500 bg-indigo-500/10 dark:bg-indigo-400/10 dark:text-indigo-400',
    activeBorder: 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-indigo-500/10'
  },
  {
    title: 'Pending',
    status: 'Pending',
    count: tasksstore.tasks.filter(task => normalizeStatus(task.status) === 'pending').length,
    icon: Clock,
    colorClass: 'text-amber-500 bg-amber-500/10 dark:bg-amber-400/10 dark:text-amber-400',
    activeBorder: 'border-amber-500 ring-2 ring-amber-500/20 shadow-amber-500/10'
  },
  {
    title: 'In Progress',
    status: 'In Progress',
    count: tasksstore.tasks.filter(task => normalizeStatus(task.status) === 'in progress').length,
    icon: Sparkles,
    colorClass: 'text-sky-500 bg-sky-500/10 dark:bg-sky-400/10 dark:text-sky-400',
    activeBorder: 'border-sky-500 ring-2 ring-sky-500/20 shadow-sky-500/10'
  },
  {
    title: 'Done',
    status: 'Done',
    count: tasksstore.tasks.filter(task => normalizeStatus(task.status) === 'done').length,
    icon: CheckCircle2,
    colorClass: 'text-emerald-500 bg-emerald-500/10 dark:bg-emerald-400/10 dark:text-emerald-400',
    activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-emerald-500/10'
  }
])
</script>

<template>
  <div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <div
      v-for="card in cards"
      :key="card.title"
      class="group relative flex cursor-pointer flex-col justify-between rounded-2xl border border-app-border bg-app-surface p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg card-hover-effect"
      :class="taskFilters.statusFilter === card.status ? card.activeBorder : 'hover:border-indigo-500/30'"
      @click="taskFilters.setStatusFilter(card.status)"
    >
      <div class="flex items-center justify-between">
        <span class="text-sm font-semibold text-app-muted transition-colors group-hover:text-app-text">
          {{ card.title }}
        </span>
        <div class="flex h-9 w-9 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110" :class="card.colorClass">
          <component :is="card.icon" class="h-4 w-4" />
        </div>
      </div>

      <div class="mt-4 flex items-baseline justify-between">
        <span class="text-3xl font-extrabold tracking-tight text-app-text">
          {{ card.count }}
        </span>
        <span
          v-if="taskFilters.statusFilter === card.status"
          class="rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-500 dark:bg-indigo-400/10 dark:text-indigo-400"
        >
          Active
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>