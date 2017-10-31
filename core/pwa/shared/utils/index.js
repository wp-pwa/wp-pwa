export const pages = [
  'saturn-app-theme-worona',
  'wp-org-connection-app-extension-worona',
]

export const nextIndex = index => ++index % pages.length

export const indexFromPath = path => {
  path = path === '/' ? '/saturn-app-theme-worona' : path
  return pages.indexOf(path.substr(1))
}
