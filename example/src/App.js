import React from 'react'
import { DugProvider } from 'dug-react'
import { SearchInterface } from './search-interface'

const myConfig = {
  DUG_URL: `https://helx.renci.org`,
  DEFAULT_REQUEST_OPTIONS: {
    index: 'concepts_index',
    size: 10,
    offset: 0,
  },
  SEARCH_REQUEST_TIMEOUT: 5000,
}

const App = () => {
  return (
    <DugProvider config={ myConfig }>
      <SearchInterface />
    </DugProvider>
  )
}

export default App
