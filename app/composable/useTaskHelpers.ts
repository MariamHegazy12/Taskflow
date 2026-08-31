export function useTaskHelpers() {
  function isOverdue(dueDate: string, status: string) {
    if (!dueDate || status.toLowerCase() === 'done') return false
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)
    const dueDateObj = new Date(dueDate)
    return dueDateObj < currentDate
  }

  function getStatusBadgeClass(status: string) {
    const norm = status.trim().toLowerCase()
    if (norm === 'done') {
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    }
    if (norm === 'in progress') {
      return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20'
    }
    return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
  }

  function formatDate(dateStr: string) {
    if (!dateStr) return ''
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    } catch {
      return dateStr
    }
  }

  return { isOverdue, getStatusBadgeClass, formatDate }
}
