export const pages = [
  'saturn-theme',
  'wp-org-connection',
]

export const nextIndex = index => ++index % pages.length

export const indexFromPath = path => {
  path = path === '/' ? '/saturn-theme' : path
  return pages.indexOf(path.substr(1))
}
