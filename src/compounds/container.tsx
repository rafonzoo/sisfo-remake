'use client'

import type { ComponentPropsWithRef } from 'react'

import { cn } from '@/lib/utils'

export function Container({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return (
    <div
      {...props}
      className={cn(
        'mx-auto mt-6 flex max-w-[87.5%] flex-col gap-6 lg:mx-10 lg:mt-10 lg:max-w-full',
        className
      )}
    />
  )
}
