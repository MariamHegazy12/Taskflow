import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Task } from '~/types/task'
import { useTaskService } from '~/services/taskService'
export const useTaskStore = defineStore('task', () => {
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchTasks() {
    loading.value = true
    error.value = null
    try {
      const { getTasks } = useTaskService()
      tasks.value = await getTasks()
    } catch (err) {
      error.value = 'Failed to fetch tasks'
    } finally {
      loading.value = false
    }
  }
  
  async function addTask(newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    loading.value = true
    error.value = null
    try {
      const { createTask } = useTaskService()
      const newTaskItem = await createTask(newTask)
      tasks.value.push(newTaskItem)
    } catch (err) {
      error.value = 'Failed to add task'
    } finally {
      loading.value = false
    }
  }

  async function updateTask(id: string, updatedTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    loading.value = true
    error.value = null
    try {
      const { updateTask: updateTaskApi } = useTaskService()
      const updatedTaskItem = await updateTaskApi(id, updatedTask)
      const index = tasks.value.findIndex((t) => t.id === id)
      if (index !== -1) {
        tasks.value[index] = updatedTaskItem
      }
    } catch (err) {
      error.value = 'Failed to update task'
    } finally {
      loading.value = false
    }
  }

  async function deleteTask(id: string) {
    loading.value = true
    error.value = null
    try {
      const { deleteTask: deleteTaskApi } = useTaskService()
      await deleteTaskApi(id)
      tasks.value = tasks.value.filter((task) => task.id !== id)
    } catch (err) {
      error.value = 'Failed to delete task'
    } finally {
      loading.value = false
    }
  }

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
  }
})