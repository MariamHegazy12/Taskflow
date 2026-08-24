import type { Task } from '~/types/task'

export function useTaskService() {
  const config = useRuntimeConfig()
  const BASE_URL = config.public.BASE_URL

  function getTasks() {
    return $fetch<Task[]>(`${BASE_URL}/tasks-2`)
  }

  function getTask(id: string) {
    return $fetch<Task>(`${BASE_URL}/tasks-2/${id}`)
  }

  function createTask(newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    return $fetch<Task>(`${BASE_URL}/tasks-2`, {
      method: 'POST',
      body: newTask,
    })
  }

  function updateTask(id: string, updatedTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    return $fetch<Task>(`${BASE_URL}/tasks-2/${id}`, {
      method: 'PUT',
      body: updatedTask,
    })
  }

  function deleteTask(id: string) {
    return $fetch(`${BASE_URL}/tasks-2/${id}`, {
      method: 'DELETE',
    })
  }

  return { getTasks, getTask, createTask, updateTask, deleteTask }
}