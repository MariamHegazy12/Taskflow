<script setup lang="ts">
import { Plus, Edit3, X } from '@lucide/vue'
import type { Task } from '~/types/task'
import { taskFormSchema } from '~/schemas/task'

const taskStore = useTaskStore()
const isOpen = ref(false)
const isEditing = ref(false)
const props = defineProps<{
  task?: Task
  isEditing?: boolean
}>()

const form = reactive<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>({
  title: '',
  description: '',
  status: 'Pending',
  dueDate: '',
})

const statusOptions = ['Pending', 'In Progress', 'Done']

function resetForm() {
  form.title = ''
  form.description = ''
  form.status = 'Pending'
  form.dueDate = ''
}

function closeModal() {
  isOpen.value = false
  resetForm()
}

async function submitTask() {
  const taskData = {
    title: form.title.trim(),
    description: form.description.trim(),
    status: form.status,
    dueDate: form.dueDate,
  }

  if (isEditing.value && props.task) {
    await taskStore.updateTask(props.task.id, taskData)
  } else {
    await taskStore.addTask(taskData)
  }

  if (!taskStore.error) {
    closeModal()
  }
}

function handleOpenModal() {
  if (props.isEditing && props.task) {
    isEditing.value = true
    form.title = props.task.title
    form.description = props.task.description
    form.status = props.task.status
    form.dueDate = props.task.dueDate
  } else {
    isEditing.value = false
    resetForm()
  }

  isOpen.value = true
}
</script>

<template>
  <!-- Trigger Buttons -->
  <button
    v-if="!props.isEditing"
    type="button"
    class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:from-indigo-700 hover:to-violet-700 hover:shadow-lg active:scale-95"
    @click="handleOpenModal"
  >
    <Plus class="h-4 w-4" />
    <span>{{ $t('addTask') }}</span>
  </button>
  <button
    v-else
    type="button"
    aria-label="Edit task"
    class="inline-flex items-center gap-1.5 rounded-lg border border-app-border bg-app-surface px-2.5 py-1.5 text-xs font-semibold text-app-text transition-all hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-indigo-500"
    @click="handleOpenModal"
  >
    <Edit3 class="h-3.5 w-3.5" />
    <span>Edit</span>
  </button>

  <!-- Modal Dialog -->
  <UModal v-model:open="isOpen" :ui="{ content: 'max-w-xl bg-app-surface border border-app-border rounded-2xl shadow-2xl p-0 overflow-hidden' }">
    <template #header>
      <div class="flex w-full items-start justify-between border-b border-app-border p-6 bg-app-surface">
        <div>
          <h2 class="text-xl font-bold tracking-tight text-app-text">{{ isEditing ? 'Edit Task' : 'Create New Task' }}</h2>
          <p class="mt-1 text-sm text-app-muted">{{ isEditing ? 'Update the details for this task.' : 'Add the details and set a target due date.' }}</p>
        </div>
        <button
          type="button"
          aria-label="Close modal"
          class="rounded-lg p-1.5 text-app-muted transition-colors hover:bg-app-surface-hover hover:text-app-text"
          @click="closeModal"
        >
          <X class="h-5 w-5" />
        </button>
      </div>
    </template>

    <template #body>
      <div class="p-6 bg-app-surface">
        <UForm id="create-task-form" :schema="taskFormSchema" :state="form" class="space-y-5" @submit="submitTask">
          <UFormField name="title" label="Title" required class="text-app-text">
            <UInput v-model="form.title" placeholder="e.g. Prepare Q3 project brief" class="w-full" autofocus />
          </UFormField>

          <UFormField name="description" label="Description" class="text-app-text">
            <template #hint>
              <span class="text-xs text-app-muted">Optional</span>
            </template>
            <UTextarea v-model="form.description" placeholder="Add context or notes for this task..." :rows="4" class="w-full" />
          </UFormField>

          <div class="grid gap-4 sm:grid-cols-2">
            <UFormField name="status" label="Status" class="text-app-text">
              <USelect v-model="form.status" :items="statusOptions" class="w-full" />
            </UFormField>

            <UFormField name="dueDate" label="Due Date" required class="text-app-text">
              <UInput v-model="form.dueDate" type="date" class="w-full" />
            </UFormField>
          </div>
        </UForm>
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
          type="submit"
          form="create-task-form"
          :disabled="taskStore.loading"
          class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md transition-all hover:bg-indigo-700 disabled:opacity-50"
        >
          <span v-if="taskStore.loading">Saving...</span>
          <span v-else>{{ isEditing ? 'Update Task' : 'Create Task' }}</span>
        </button>
      </div>
    </template>
  </UModal>
</template>

