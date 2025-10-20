'use client'

import { ChevronDownIcon } from 'lucide-react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { cn } from '@/lib/utils'

function Accordion({ ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot='accordion' {...props} />
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot='accordion-item'
      className={cn('border-b last:border-b-0', className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className='flex'>
      <AccordionPrimitive.Trigger
        data-slot='accordion-trigger'
        className={cn(
          'focus-visible:bg-foreground/5 transition-field flex flex-1 items-start justify-between gap-4 px-3 py-2.5 text-left font-medium outline-none focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
          className
        )}
        {...props}
      >
        {/* `asChild` won't allow multi children with built-in chevron */}
        {props.asChild ? (
          children
        ) : (
          <>
            {children}
            <ChevronDownIcon className='text-muted-foreground pointer-events-none relative ml-auto size-4 shrink-0 transition-transform duration-200 [[data-disable-chevron="true"]_&]:hidden [[data-state=open]>&]:rotate-180' />
          </>
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot='accordion-content'
      className='data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden'
      {...props}
    >
      <div className={className}>{children}</div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
