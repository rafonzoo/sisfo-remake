'use client'

import type { FC, ReactNode } from 'react'

import { usePathname } from 'next/navigation'
import { default as Link } from 'next/link'
import { cn } from '@/lib/utils'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/breadcrumb'

export type BreadcrumbsConfig = {
  path: string
  alias: ReactNode
}

export type BreadcrumbsProps = {
  config: BreadcrumbsConfig[]
  separator?: ReactNode
  classNames?: {
    root?: string
    list?: string
    item?: string
    page?: string
    link?: string
    wrapper?: string
    separator?: string
  }
}

/**
 * @example
 * <Breadcrumbs
     classNames={{ root: 'w-fit bg-secondary' }}
     config={[
       { path: '/', alias: 'User Management' },
       { path: '/import-user', alias: 'Import User' },
     ]}
    />
 */
export const Breadcrumbs: FC<BreadcrumbsProps> = ({ config, separator, classNames }) => {
  return (
    <Breadcrumb className={cn(classNames?.root || void 0)}>
      <BreadcrumbList className={cn(classNames?.list) || void 0}>
        {config.map(({ path, alias }, index) => (
          <div key={index} className='flex items-center'>
            {!!index && (
              <BreadcrumbSeparator
                className={cn('z-0 mx-2.5 hidden md:block', classNames?.separator)}
              >
                {separator}
              </BreadcrumbSeparator>
            )}
            {index === config.length - 1 ? (
              <BreadcrumbItem className={cn(classNames?.item) || void 0}>
                <BreadcrumbPage className={cn(classNames?.page) || void 0}>{alias}</BreadcrumbPage>
              </BreadcrumbItem>
            ) : (
              <BreadcrumbItem className={cn('hidden md:block', classNames?.item)}>
                <BreadcrumbLink asChild>
                  <Link href={path} className={cn(classNames?.link) || void 0}>
                    {alias}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export const BreadcrumbsLinked: FC<Omit<BreadcrumbsProps, 'config'>> = ({
  separator,
  classNames,
}) => {
  const pathname = usePathname()
  const src = pathname
    .replace(/\/\//g, '/')
    .split('/')
    .filter(Boolean)
    .map((item) => ({ path: item, alias: item.replace(/-/g, ' ') }))

  return (
    <Breadcrumb className={cn(classNames?.root || void 0)}>
      <BreadcrumbList
        className={
          cn('bg-background w-fit rounded px-2 py-1 text-sm tracking-normal', classNames?.list) ||
          void 0
        }
      >
        {src.map(({ path, alias }, index) => (
          <div key={index} className={cn('flex items-center capitalize', classNames?.wrapper)}>
            {!!index && (
              <BreadcrumbSeparator className={cn('z-0 mx-2', classNames?.separator)}>
                {separator}
              </BreadcrumbSeparator>
            )}
            {index === src.length - 1 ? (
              <BreadcrumbItem className={cn(classNames?.item) || void 0}>
                <BreadcrumbPage className={cn(classNames?.page) || void 0}>{alias}</BreadcrumbPage>
              </BreadcrumbItem>
            ) : (
              <BreadcrumbItem className={cn(classNames?.item)}>
                <BreadcrumbLink asChild>
                  <Link href={path} className={cn(classNames?.link) || void 0}>
                    {alias}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
