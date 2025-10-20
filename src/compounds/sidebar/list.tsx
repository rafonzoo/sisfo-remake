'use client'

import type { RefObject } from 'react'
import type { SidebarLayoutOption } from '@/compounds/sidebar/layout'

import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronDownIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { collectOpenAccordions } from '@/lib/helpers'
import { SidebarButton, SidebarMenuItem, useSidebar } from '@/components/sidebar'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/accordion'

export function SidebarList({ items }: { items: SidebarLayoutOption[] }) {
  const path = usePathname()
  const router = useRouter()
  const { sidebarAccordionRef } = useSidebar()
  const { open, isMobile, setOpen, setOpenMobile } = useSidebar()
  const openedNavbarRef = useRef(sidebarAccordionRef.current)

  useEffect(
    () => void (openedNavbarRef.current = collectOpenAccordions(items, path)),
    [items, path]
  )

  function onClickHandler(pathname: string, shouldNewTab = false) {
    if (path === pathname) return

    if (shouldNewTab) {
      return window.open(pathname)
    }

    router.push(pathname)
    sidebarAccordionRef.current = []
    sidebarAccordionRef.current = collectOpenAccordions(items, pathname) // Only selected route path

    // Override without duplicate
    // sidebarAccordionRef.current = [...new Set([...sidebarAccordionRef.current, pathname])]

    // Close sidebar each time navigated through mobile and
    // prevent accordion closed before sidebar is closed
    if (isMobile && path) setOpenMobile(false)
  }

  function joinPaths(...paths: string[]): string {
    return paths
      .filter(Boolean)
      .map((p, i) => (i === 0 ? p.replace(/\/$/, '') : p.replace(/^\/|\/$/g, '')))
      .join('/')
  }

  function RenderItem({
    item,
    rootPath = '',
  }: {
    item: SidebarLayoutOption
    sidebarAccordionRef: RefObject<string[]>
    rootPath?: string
  }) {
    const { aliases, icon, child, path: itemPath, newTab = false, exact = false } = item
    const fullPath = exact ? itemPath : joinPaths(rootPath, itemPath)
    const hasChild = child && child.length > 0

    if (hasChild) {
      return (
        <Accordion key={itemPath} type='multiple' defaultValue={sidebarAccordionRef.current}>
          <AccordionItem value={itemPath}>
            <AccordionTrigger asChild>
              <SidebarButton
                suppressHydrationWarning
                variant='ghost'
                title={!open ? aliases : void 0}
                className={cn(
                  'relative items-center pr-0 whitespace-nowrap focus-visible:ring-0',
                  !open && '!opacity-100',
                  !open &&
                    openedNavbarRef.current.some((cur) => cur === itemPath) &&
                    'before:h-field !text-primary-foreground before:bg-primary hover:before:bg-primary before:absolute before:w-full before:rounded-sm'
                )}
                disabled={itemPath === path && !hasChild}
                onClick={(e) => {
                  if (!open) {
                    setOpen(true)
                    return (sidebarAccordionRef.current = [
                      ...new Set([...sidebarAccordionRef.current, itemPath]),
                    ])
                  }

                  if (child) {
                    const current = sidebarAccordionRef.current

                    if (current.includes(itemPath)) {
                      return (sidebarAccordionRef.current = current.filter(
                        (item) => item !== itemPath
                      ))
                    }

                    return (sidebarAccordionRef.current = [
                      ...new Set([...sidebarAccordionRef.current, itemPath]),
                    ])
                  }

                  if (!rootPath) {
                    throw new Error('Missing "path" key')
                  }

                  // If root doesn't have child route then path is required and it should prevent accordio trigger
                  // while it direct to rootPath
                  e.preventDefault()
                  onClickHandler(rootPath, newTab)
                }}
              >
                {icon}
                <span className='[[data-collapsible][data-state=collapsed]_&]:opacity-0'>
                  {aliases}
                </span>
                <ChevronDownIcon
                  data-disable-chevron={!hasChild}
                  className='text-sidebar-accent-foreground/40 pointer-events-none relative mr-3 ml-auto size-4 shrink-0 transition-transform duration-200 data-[disabled-chevron=true]:hidden [[data-state=open]>*>&]:rotate-180'
                />
              </SidebarButton>
            </AccordionTrigger>
            <AccordionContent
              className='pl-8 *:mt-0.5 [[data-has-valid-root-path="true"]_&]:hidden'
              data-has-valid-root-path={!hasChild && !!itemPath}
              suppressHydrationWarning
            >
              {child
                ?.sort((a, b) => (a.priority ?? 10) - (b.priority ?? 10))
                .map((c) => (
                  <RenderItem
                    key={c.path}
                    {...{ item: c, sidebarAccordionRef }}
                    rootPath={fullPath}
                  />
                ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )
    }

    return (
      <SidebarButton
        suppressHydrationWarning
        variant='ghost'
        key={itemPath}
        disabled={fullPath === path}
        title={!open ? aliases : void 0}
        onClick={() => onClickHandler(fullPath, newTab)}
        className={cn(
          'relative whitespace-nowrap',
          fullPath === path && 'before:bg-primary text-primary-foreground',
          '[[data-collapsible][data-state=collapsed]_[data-slot=accordion]_&]:before:bg-transparent'
        )}
      >
        {icon}
        <span className='[[data-collapsible][data-state=collapsed]_&]:opacity-0'>{aliases}</span>
      </SidebarButton>
    )
  }

  return [...items]
    .sort((a, b) => (a.priority ?? 10) - (b.priority ?? 10))
    .map((item) => (
      <SidebarMenuItem key={item.path}>
        <RenderItem {...{ item, sidebarAccordionRef }} />
      </SidebarMenuItem>
    ))
}
