// Minimal shadcn-style toast hook stub. Re-exports from sonner where needed.
import * as React from "react"

type ToastT = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  variant?: "default" | "destructive"
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const listeners = new Set<(toasts: ToastT[]) => void>()
let memoryToasts: ToastT[] = []

function emit() { listeners.forEach(l => l(memoryToasts)) }

export function toast(props: Omit<ToastT, "id">) {
  const id = Math.random().toString(36).slice(2)
  const t: ToastT = { id, open: true, ...props }
  memoryToasts = [t, ...memoryToasts].slice(0, 5)
  emit()
  return { id, dismiss: () => { memoryToasts = memoryToasts.filter(x => x.id !== id); emit() } }
}

export function useToast() {
  const [toasts, setToasts] = React.useState<ToastT[]>(memoryToasts)
  React.useEffect(() => {
    listeners.add(setToasts)
    return () => { listeners.delete(setToasts) }
  }, [])
  return { toasts, toast, dismiss: (id?: string) => {
    memoryToasts = id ? memoryToasts.filter(t => t.id !== id) : []
    emit()
  }}
}