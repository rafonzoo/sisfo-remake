import type { SidebarLayoutOption } from '@/compounds/sidebar/layout'

export function collectOpenAccordions(navs: SidebarLayoutOption[], currentPath: string): string[] {
  const result: string[] = []

  function traverse(items: SidebarLayoutOption[], parents: string[]) {
    for (const item of items) {
      const isExact = item.exact === true
      const match = isExact ? currentPath === item.path : currentPath.startsWith(item.path)

      // If matches, save all parent + item.path
      if (match) {
        result.push(...parents, item.path)
      }

      // Has any child, do recursion
      if (item.child && item.child.length > 0) {
        traverse(item.child, [...parents, item.path])
      }
    }
  }

  traverse(navs, [])
  return Array.from(new Set(result)) // Clean up
}
