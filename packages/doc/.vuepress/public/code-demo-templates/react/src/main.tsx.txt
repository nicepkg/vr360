import React from 'react'
import ReactDOM from 'react-dom'
import Example from './Example'

import '@unocss/reset/tailwind.css'
import 'uno.css'

ReactDOM.render(
  <React.StrictMode>
    <Example />
  </React.StrictMode>,
  document.querySelector('#app')
)
