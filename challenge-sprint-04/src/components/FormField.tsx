import type { InputHTMLAttributes } from 'react';
type Props = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }
export function FormField({ label, error, id, ...props }: Props){
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-gray-800">{label}</span>
      <input id={id} {...props}
        className={`w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-accent ${error? 'border-red-500' : 'border-gray-300'}`} />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  )
}
