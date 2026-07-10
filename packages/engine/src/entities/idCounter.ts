export const createIdCounter = (prefix: string) => {
  let counter = 1
  const pattern = new RegExp(`^${prefix}(\\d+)$`)

  const sync = (ids: string[]) => {
    const max = ids.reduce((m, id) => {
      const match = id.match(pattern)
      return match ? Math.max(m, parseInt(match[1], 10)) : m
    }, 0)
    if (max >= counter) counter = max + 1
  }

  const next = () => `${prefix}${counter++}`

  return { sync, next }
}
