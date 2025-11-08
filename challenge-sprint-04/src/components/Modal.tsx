import { type ReactNode, useEffect } from 'react'

type ModalProps = {
  title: string
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export function Modal({ title, isOpen, onClose, children }: ModalProps){
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    if(isOpen){ document.addEventListener('keydown', onEsc); return () => document.removeEventListener('keydown', onEsc) }
  }, [isOpen, onClose])

  if(!isOpen) return null

  return (
    <div role="dialog" aria-modal className="fixed inset-0 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button className="text-2xl leading-none" aria-label="Fechar" onClick={onClose}>&times;</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
