<script setup lang="ts">
import { AlertTriangle, Trash2, X } from '@lucide/vue'
import type { Task } from '~/types/task'

defineProps<{
  open: boolean
  task: Pick<Task, 'id' | 'title'> | null
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:open': [open: boolean]
  confirm: []
}>()

function closeModal() {
  emit('update:open', false)
}
</script>

<template>
  <UModal :open="open" :ui="{ content: 'max-w-md bg-app-surface border border-app-border rounded-2xl shadow-2xl p-0 overflow-hidden' }" @update:open="emit('update:open', $event)">
    <template #header>
      <div class="flex w-full items-start justify-between border-b border-app-border p-5 bg-app-surface">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500">
            <AlertTriangle class="h-5 w-5" />
          </div>
          <div>
            <h2 class="text-lg font-bold text-app-text">Delete Task</h2>
            <p class="text-xs text-app-muted">This action cannot be undone.</p>
          </div>
        </div>
        <button
          type="button"
          aria-label="Close modal"
          class="rounded-lg p-1 text-app-muted transition-colors hover:bg-app-surface-hover hover:text-app-text"
          @click="closeModal"
        >
          <X class="h-4 w-4" />
        </button>
      </div>
    </template>

    <template #body>
      <div class="p-5 bg-app-surface">
        <p class="text-sm leading-relaxed text-app-muted">
          Are you sure you want to permanently delete
          <span class="font-bold text-app-text">"{{ task?.title }}"</span>?
        </p>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full items-center justify-end gap-3 border-t border-app-border p-4 bg-app-surface">
        <button
          type="button"
          class="rounded-xl border border-app-border bg-transparent px-4 py-2 text-xs font-semibold text-app-text transition-colors hover:bg-app-surface-hover"
          @click="closeModal"
        >
          Cancel
        </button>
        <button
          type="button"
          :disabled="loading"
          class="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-md transition-all hover:bg-rose-700 disabled:opacity-50"
          @click="emit('confirm')"
        >
          <Trash2 class="h-3.5 w-3.5" />
          <span>{{ loading ? 'Deleting...' : 'Delete Task' }}</span>
        </button>
      </div>
    </template>
  </UModal>
</template>

