'use client'

import type { FC, PropsWithChildren, ReactNode } from 'react'

import { SidebarList } from '@/compounds/sidebar/list'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/sidebar'

export interface SidebarLayoutOption {
  path: string
  aliases: string
  priority?: number
  icon?: React.ReactNode
  newTab?: boolean
  exact?: boolean
  child?: (Omit<SidebarLayoutOption, 'icon' | 'child' | 'path'> &
    Partial<Pick<SidebarLayoutOption, 'child'>> &
    Required<Pick<SidebarLayoutOption, 'path'>>)[]
}

export interface SidebarLayoutProps {
  menus: SidebarLayoutOption[]
  footer?: ReactNode
}

export const SidebarLayout: FC<PropsWithChildren<SidebarLayoutProps>> = ({
  menus,
  footer,
  children,
}) => {
  return (
    <SidebarProvider {...{ menus }}>
      <Sidebar collapsible='icon'>
        <SidebarHeader>
          <SidebarGroup className='p-2'>
            <SidebarTrigger className='size-11' />
          </SidebarGroup>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent className='overflow-x-hidden'>
          <SidebarGroup className='p-2'>
            <SidebarMenu>
              <SidebarList items={menus} />
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        {footer && <SidebarFooter>{footer}</SidebarFooter>}
      </Sidebar>
      <SidebarInset>
        <div className='flex shrink-0 items-center gap-2 border-b py-2 md:hidden'>
          <div className='flex items-center gap-2 px-2'>
            <SidebarTrigger className='size-11' />
          </div>
        </div>
        <div className='h-full w-full'>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
