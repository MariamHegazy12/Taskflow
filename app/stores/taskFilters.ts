import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useTaskStore } from '~/stores/tasks'

export const useTaskFiltersStore = defineStore('taskFilters', () => {
  const tasksStore = useTaskStore()
  const searchTerm = ref('')
  const statusFilter = ref('all')

  const filteredTasks = computed(() => tasksStore.tasks.filter((task) => {
    const matchesStatus = statusFilter.value === 'all' || task.status.trim().toLowerCase() === statusFilter.value.trim().toLowerCase()
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.value.trim().toLowerCase())

    return matchesStatus && matchesSearch
  }))

  function setStatusFilter(status: string) {
    statusFilter.value = status
  }

  return {
    searchTerm,
    statusFilter,
    filteredTasks,
    setStatusFilter,
  }
})
