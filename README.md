# dug-react

> Made with `create-react-library`

[![NPM](https://img.shields.io/npm/v/helx-search.svg)](https://www.npmjs.com/package/@renci/helx-react-search) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @renci/dug-react
```

## Usage

### The Dug Context

The names export `DugProvider` is a React context provider that should wrap any and all Dug search functionality in your application.

```jsx
// app.js
import React from 'react'
import { DugProvider } from '@renci/dug-react'
import { MyCustomSearchInterface } from './my-search-interface'

export const App = () => {
  return (
    <DugProvider>
      <h1>Dug Search</h1>

      <MyCustomSearchInterface />

    </DugProvider>
  )
}
```

Any child component, such as the `<MyCustomSearchInterface />` component in the above example, has access to the Dug context.

The search context provides access to
- the search function;
- the loading state;
- the results;
- the number of pages of results (depends on `page` and `perPage` config options).

### The `useDug` Hook

```jsx
// my-search-interface.js
import React, { Fragment, useRef, useState } from 'react'
import { useDug } from 'dug-react'

export const MyCustomSearchInterface = () => {
  const searchInput = useRef()
  const { doSearch, hits, loading, pageCount, total } = useDug({
    index: 'concepts_index',
  })
  const [perPage, setPerPage] = useState(10)
  const [page, setPage] = useState(1)

  const handleSubmit = () => {
    const mySearchTerm = searchInput.current.value
    doSearch(mySearchTerm, { perPage: perPage, page: page })
  }

  return (
    <div>
      <hr/>

      <input value="heart" ref={ searchInput }/>
      <button onClick={ handleSubmit }>submit</button>
      
      <hr/>

      {
        loading && <div>Searching...</div>
      }

      {
        !loading && (
          <Fragment>
            { total } hits<br/>
            { pageCount } pages<br/>

            <hr/>

            {
              hits.map(hit => <div key={ hit.id }>{ hit.id } :: { hit.name }</div>)
            }
          </Fragment>
        )
      }

    </div>
  )
}

```
## License

MIT
