/* eslint-disable global-require */
import React from 'react'
import ReactDOM from 'react-dom'
import createHistory from 'history/createBrowserHistory'
import { AppContainer } from 'react-hot-loader'
import App from './components/App'

const history = createHistory()

const render = Component =>
  ReactDOM.hydrate(
    <AppContainer>
      <Component history={history} />
    </AppContainer>,
    document.getElementById('root')
  )

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./components/App.js', () => {
    const Component = require('./components/App').default
    render(Component)
  })
}

render(App)
