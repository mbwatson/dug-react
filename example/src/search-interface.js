import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import ReactJson from 'react-json-view'
import { useDug } from 'dug-react'

const Result = ({ hit }) => {
  return (
    <ReactJson
      key={ hit.id }
      src={ hit }
      theme="ocean"
      collapsed={ true }
      style={{ padding: '1rem', marginBottom: '1rem', lineHeight: 1.5 }}
    />
  )
}

export const SearchInterface = () => {
  const searchInput = useRef()
  const { fetchResults, hits, loading, pageCount, total } = useDug({ index: 'concepts_index' })
  const [page, setPage] = useState(1)

  const handleSubmit = () => {
    const mySearchTerm = searchInput.current.value
    fetchResults(mySearchTerm, { page: 1 })
  }

  const handleGoToPage = newPage => event => {
    const mySearchTerm = searchInput.current.value
    setPage(newPage)
    fetchResults(mySearchTerm, { page: newPage })
  }

  return (
    <div>
      <hr/>

      <input defaultValue="heart" ref={ searchInput }/>
      <button onClick={ handleSubmit }>submit</button>
      
      <hr/>

      {
        loading ? (
          <Loader />
        ) : (
          <Fragment>
            { total } hits<br/>
            { pageCount ? `page ${ page } / ${ pageCount }` : `0 pages` }<br/>

            {
              /* pagination buttons. loop over [0, 1, 2, ..., (pageCount - 1)] */
              [...Array(pageCount).keys()].map(p => (
                <button
                  key={ `pagination-button-${ p }`}
                  disabled={ page === p + 1 }
                  onClick={ handleGoToPage(p + 1) }
                >{ p + 1 }</button>
              ))
            }

            <hr/>

            {
              hits.map((hit, i) => <Result key={ hit.id } hit={ hit } />)
            }
          </Fragment>
        )
      }

    </div>
  )
}

const Loader = ({ dotCount = 4 }) => {
  const [count, setCount] = useState(0)

  const msTimeout = useMemo(() => 1000 / (dotCount + 1), [dotCount])
  
  useEffect(() => {
    const timer = setTimeout(() => setCount((count + 1) % (dotCount + 1)), msTimeout)
    return () => clearTimeout(timer)
  })

  const dots = useMemo(() => [...Array(count + 1).keys()].map(i => <span key={ i }>{ i === 0 ? ' ' : '. ' }</span>), [count])

  return (
    <div>
      Loading { dots }
    </div>
  )
}
