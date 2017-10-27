export const pages = [
  'general-app-extension-worona',
  'saturn-app-theme-worona',
  'wp-org-connection-app-extension-worona',
]

export const nextIndex = index => ++index % pages.length

export const indexFromPath = path => {
  path = path === '/' ? '/general-app-extension-worona' : path
  return pages.indexOf(path.substr(1))
}
