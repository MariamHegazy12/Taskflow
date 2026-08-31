<script setup lang="ts">
import { Trash2, Calendar, AlertTriangle } from '@lucide/vue'
import AddTaskModal from '~/components/tasks/AddTaskModal.vue'
import DeleteTaskModal from '~/components/tasks/DeleteTaskModal.vue'
import { useTaskHelpers } from '~/composable/useTaskHelpers'
const tasksStore = useTaskStore()
const route = useRoute()
const { t } = useI18n()
const { isOverdue, getStatusBadgeClass, formatDate } = useTaskHelpers()

const taskId = route.params.id as string

await tasksStore.fetchTasks()

const task = computed(() =>
  tasksStore.tasks.find((t) => String(t.id) === taskId)
)

const deleteModalOpen = ref(false)
const taskToDelete = ref<{ id: string; title: string } | null>(null)

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
    await navigateTo('/tasks')
  }
}
</script>

<template>
  <main class="min-h-screen bg-app-bg pb-16 pt-8 text-app-text transition-colors duration-200">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  <div class="mt-6">
    <!-- Task not found -->
    <div
      v-if="!task"
      class="rounded-2xl border border-app-border bg-app-surface p-6 text-center"
    >
      <p class="text-app-muted">
        Task not found.
      </p>

      <NuxtLink
        to="/tasks"
        class="mt-4 inline-flex rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600"
      >
        Back to Tasks
      </NuxtLink>
    </div>

    <!-- Task Details -->
    <div
      v-else
      class="rounded-2xl border border-app-border bg-app-surface p-6"
    >
      <!-- Header -->
      <div class="flex items-start justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-app-text">
            {{ task.title }}
          </h1>

          <p class="mt-2 text-sm text-app-muted">
            {{ task.description || 'No description provided.' }}
          </p>
        </div>

        <!-- Status -->
        <span
          class="shrink-0 rounded-full border px-3 py-1 text-xs font-semibold"
          :class="getStatusBadgeClass(task.status)"
        >
          {{ task.status }}
        </span>
      </div>

      <!-- Task Information -->
      <div class="mt-6 grid gap-4 sm:grid-cols-2">
        <!-- Due Date -->
        <div class="rounded-xl border border-app-border p-4">
          <div class="flex items-center gap-2 text-sm font-semibold text-app-text">
            <Calendar class="h-4 w-4" />
            Due Date
          </div>

          <p class="mt-2 text-sm text-app-muted">
            <template v-if="task.dueDate">
              {{ formatDate(task.dueDate) }}
            </template>

            <template v-else>
              No due date
            </template>
          </p>
        </div>

        <!-- Overdue -->
        <div
          v-if="isOverdue(task.dueDate, task.status)"
          class="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4"
        >
          <div class="flex items-center gap-2 text-sm font-semibold text-rose-500">
            <AlertTriangle class="h-4 w-4" />
            Overdue
          </div>

          <p class="mt-2 text-sm text-rose-500">
            This task is overdue.
          </p>
        </div>
      </div>

      <!-- Actions -->
      <div
        class="mt-6 flex items-center justify-between border-t border-app-border/60 pt-4"
      >
        <NuxtLink
          to="/tasks"
          class="rounded-lg border border-app-border px-4 py-2 text-sm font-semibold text-app-text transition hover:bg-app-surface/80"
        >
          Back to Tasks
        </NuxtLink>

        <div class="flex items-center gap-2">
          <AddTaskModal
            :task="task"
            :isEditing="true"
          />

          <button
            type="button"
            aria-label="Delete task"
            class="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/20 bg-rose-500/5 px-3 py-2 text-xs font-semibold text-rose-500 transition-all hover:bg-rose-500 hover:text-white"
            @click="openDeleteModal(task)"
          >
            <Trash2 class="h-3.5 w-3.5" />
            <span>{{ $t('delete') }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>

    <DeleteTaskModal
      v-model:open="deleteModalOpen"
      :task="taskToDelete"
      :loading="tasksStore.loading"
      @confirm="confirmDeleteTask"
    />
    </div>
  </main>
</template>
