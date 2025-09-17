import React from 'react'
import { useToast } from '../contexts/ToastContext'
import {
  ToastProvider as RadixToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose
} from '../components/ui/toast'

const ToastContainer = () => {
  const { toasts, removeToast } = useToast()

  return (
    <RadixToastProvider>
      {toasts.map((toast) => (
        <Toast key={toast.id} variant={toast.variant}>
          <div className="grid gap-1">
            <ToastTitle>{toast.title}</ToastTitle>
            <ToastDescription>{toast.description}</ToastDescription>
          </div>
          <ToastClose onClick={() => removeToast(toast.id)} />
        </Toast>
      ))}
      <ToastViewport />
    </RadixToastProvider>
  )
}

export default ToastContainer