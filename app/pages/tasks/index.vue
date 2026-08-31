<script setup lang="ts">
import { Trash2, Calendar, AlertTriangle, Search, Inbox, Sparkles, Filter } from '@lucide/vue'
import AddTaskModal from '~/components/tasks/AddTaskModal.vue'
import DeleteTaskModal from '~/components/tasks/DeleteTaskModal.vue'
import { useTaskHelpers } from '~/composable/useTaskHelpers'

const tasksStore = useTaskStore()
const taskFilters = useTaskFiltersStore()
const { t } = useI18n()
const { isOverdue, getStatusBadgeClass, formatDate } = useTaskHelpers()

const deleteModalOpen = ref(false)
const taskToDelete = ref<{ id: string; title: string } | null>(null)

const tasks = await tasksStore.fetchTasks()

function openDeleteModal(task: { id: string; title: string }) {
  taskToDelete.value = task
  deleteModalOpen.value = true
}

function closeDeleteModal() {
  deleteModalOpen.value = false
  taskToDelete.value = null
}

async function confirmDeleteTask() {
  if (!taskToDelete.value) return
  await tasksStore.deleteTask(taskToDelete.value.id)
  if (!tasksStore.error) {
    closeDeleteModal()
  }
}
</script>

<template>
  <main class="min-h-screen bg-app-bg pb-16 pt-8 text-app-text transition-colors duration-200">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      
      <!-- Hero / Header Section -->
      <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div class="space-y-2">
          <div class="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-500 dark:text-indigo-400">
            <Sparkles class="h-3.5 w-3.5" />
            <span>{{ $t('workspace') }}</span>
          </div>
          <h1 class="text-3xl font-extrabold tracking-tight text-app-text sm:text-4xl">
            {{ $t('tasks') }}
          </h1>
          <p class="max-w-2xl text-base text-app-muted">
            {{ $t('workspaceDescription') }}
          </p>
        </div>

        <!-- Search Input -->
        <div class="relative w-full lg:w-80">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-app-muted">
            <Search class="h-4 w-4" />
          </div>
          <input
            v-model="taskFilters.searchTerm"
            type="text"
            :placeholder="$t('search')"
            class="w-full rounded-xl border border-app-border bg-app-surface py-2.5 pl-10 pr-4 text-sm text-app-text placeholder-app-muted outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <Kpis />

      <!-- Task List Header & Controls -->
      <div class="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3">
          <h2 class="text-xl font-bold tracking-tight text-app-text">
            {{ $t('allTasks') }}
          </h2>
          <span class="rounded-full bg-app-surface px-2.5 py-0.5 text-xs font-bold text-app-muted border border-app-border">
            {{ taskFilters.filteredTasks.length }}
          </span>
        </div>

        <!-- Active Filter Indicator -->
        <div v-if="taskFilters.statusFilter !== 'all'" class="flex items-center gap-2">
          <span class="text-xs text-app-muted">Filtered by:</span>
          <span class="inline-flex items-center gap-1 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-500">
            <Filter class="h-3 w-3" />
            {{ taskFilters.statusFilter }}
            <button class="ml-1 hover:text-indigo-700" @click="taskFilters.setStatusFilter('all')">×</button>
          </span>
        </div>
      </div>

      <!-- Task Cards Grid / List -->
      <div v-if="taskFilters.filteredTasks.length > 0" class="mt-6 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="task in taskFilters.filteredTasks"
          :key="task.id"
          class="group relative flex flex-col justify-between rounded-2xl border border-app-border bg-app-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg card-hover-effect"
        >
          <div>
            <!-- Header: Title & Status -->
            <div class="flex items-start justify-between gap-3">
    
              <NuxtLinkLocale :to="`/tasks/${task.title.replace(/\s+/g, '-').toLowerCase()}${task.id}`" class="text-base font-bold text-app-text group-hover:text-indigo-500 transition-colors">
                {{ task.title }}
              </NuxtLinkLocale>
              <span
                class="shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors"
                :class="getStatusBadgeClass(task.status)"
              >
                {{ task.status }}
              </span>

            </div>

            <!-- Description -->
            <p class="mt-2.5 text-sm text-app-muted line-clamp-3 leading-relaxed">
              {{ task.description || 'No description provided.' }}
            </p>
          </div>

          <!-- Footer: Meta & Action Buttons -->
          <div class="mt-6 pt-4 border-t border-app-border/60 flex items-center justify-between gap-3">
            <!-- Due Date & Overdue Indicator -->
            <div class="flex items-center gap-1.5 text-xs font-medium">
              <template v-if="isOverdue(task.dueDate, task.status)">
                <span class="inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-2 py-1 text-rose-500 font-semibold border border-rose-500/20">
                  <AlertTriangle class="h-3.5 w-3.5" />
                  Overdue ({{ formatDate(task.dueDate) }})
                </span>
              </template>
              <template v-else-if="task.dueDate">
                <span class="inline-flex items-center gap-1 text-app-muted">
                  <Calendar class="h-3.5 w-3.5" />
                  {{ formatDate(task.dueDate) }}
                </span>
              </template>
              <template v-else>
                <span class="text-app-muted/60">No due date</span>
              </template>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center gap-2">
              <AddTaskModal :task="task" :isEditing="true" />
              <button
                type="button"
                aria-label="Delete task"
                class="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/20 bg-rose-500/5 px-2.5 py-1.5 text-xs font-semibold text-rose-500 transition-all hover:bg-rose-500 hover:text-white"
                @click="openDeleteModal(task)"
              >
                <Trash2 class="h-3.5 w-3.5" />
                <span>{{ $t('delete') }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="mt-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-app-border bg-app-surface/50 p-12 text-center">
        <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500">
          <Inbox class="h-8 w-8" />
        </div>
        <h3 class="mt-4 text-lg font-bold text-app-text">No tasks found</h3>
        <p class="mt-1 text-sm text-app-muted">
          {{ taskFilters.searchTerm ? 'Try adjusting your search terms or filters.' : 'Get started by creating your first task.' }}
        </p>
        <button
          v-if="taskFilters.searchTerm || taskFilters.statusFilter !== 'all'"
          type="button"
          class="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md transition-all hover:bg-indigo-700"
          @click="taskFilters.searchTerm = ''; taskFilters.setStatusFilter('all')"
        >
          Clear Filters
        </button>
      </div>

    </div>

    <!-- Delete Task Modal -->
    <DeleteTaskModal
      v-model:open="deleteModalOpen"
      :task="taskToDelete"
      :loading="tasksStore.loading"
      @confirm="confirmDeleteTask"
    />
  </main>
</template>

<style scoped></style>
