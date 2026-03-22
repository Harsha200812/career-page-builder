'use client'

import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  as?: 'input' | 'textarea'
  className?: string
  style?: React.CSSProperties
  rows?: number
}

export default function EditableText({
  value,
  onChange,
  placeholder = '',
  as = 'input',
  className = '',
  style,
  rows = 3,
}: Props) {
  const sharedProps = {
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
    placeholder,
    style,
  }

  if (as === 'textarea') {
    return (
      <textarea 
        {...sharedProps} 
        rows={rows} 
        className={cn("bg-transparent outline-none resize-none overflow-hidden", className)} 
      />
    )
  }

  return (
    <input 
      type="text" 
      {...sharedProps} 
      className={cn("bg-transparent outline-none", className)} 
    />
  )
}
