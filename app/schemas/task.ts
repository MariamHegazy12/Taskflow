import { z } from 'zod'

export const taskFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(100, 'Title must be 100 characters or fewer'),
  description: z.string().trim().max(500, 'Description must be 500 characters or fewer'),
  status: z.enum(['Pending', 'In Progress', 'Done']),
  dueDate: z.string().min(1, 'Due date is required').refine((value) => {
    const selectedDate = new Date(`${value}T00:00:00`)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return selectedDate >= today
  }, 'Due date must be today or a future date'),
})
