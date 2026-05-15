import { ref } from 'vue'

export interface Toast {
  id:      number
  type:    'success' | 'error' | 'warning' | 'info'
  message: string
}

const toasts = ref<Toast[]>([])
let nextId = 0

function add(type: Toast['type'], message: string, duration = 4000) {
  const id = ++nextId
  toasts.value.push({ id, type, message })
  setTimeout(() => remove(id), duration)
}

function remove(id: number) {
  const idx = toasts.value.findIndex(t => t.id === id)
  if (idx !== -1) toasts.value.splice(idx, 1)
}

export function useToast() {
  return {
    toasts,
    success: (msg: string, ms?: number) => add('success', msg, ms),
    error:   (msg: string, ms?: number) => add('error',   msg, ms),
    warning: (msg: string, ms?: number) => add('warning', msg, ms),
    info:    (msg: string, ms?: number) => add('info',    msg, ms),
    remove,
  }
}
