import React, { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { fetchWithTimeout } from './fetch-with-timeout'
import DEFAULT_CONFIG from './default-config'

const DugContext = createContext({})

export const useDug = () => useContext(DugContext)

export const DugProvider = ({ config, children }) => {
  const dugConfig = { ...DEFAULT_CONFIG, ...config }
  const { DUG_URL, DEFAULT_REQUEST_OPTIONS, SEARCH_REQUEST_TIMEOUT } = dugConfig
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(false)
  const [hits, setHits] = useState([])
  const [total, setTotal] = useState(0)
  const [error, setError] = useState()
  const [pageCount, setPageCount] = useState(0)
  const [searchOptions, setSearchOptions] = useState(DEFAULT_REQUEST_OPTIONS)

  const fetchResults = async (query, options) => {
    setLoading(true)
   
    const trimmedQuery = query.trim()
    if (trimmedQuery === '') { return }

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: trimmedQuery,
        ...searchOptions,
      }),
    }

    try {
      const response = await fetchWithTimeout(`${ DUG_URL }/search`, requestOptions, SEARCH_REQUEST_TIMEOUT)
      let result = await response.json()
      if (!response || response.status !== 200) {
        throw new Error('Failed response')
      }
      setHits(result.result.hits.hits.map(r => r._source))
      setTotal(result.result.total_items)
      setPageCount(Math.ceil(result.result.total_items / searchOptions.size))
    } catch (error) {
      console.log(error)
      setError(`An error occurred while fetching results.`)
    }
    setLoading(false)
  }
  
  return (
    <DugContext.Provider value={{ fetchResults, hits, loading, pageCount, total }}>
      { children }
    </DugContext.Provider>
  )
}

DugProvider.propTypes = {
  config: PropTypes.shape({
    DUG_URL: PropTypes.string.isRequired,
    DEFAULT_REQUEST_OPTIONS: PropTypes.shape({
      index: PropTypes.string.isRequired,
      size: PropTypes.number.isRequired,
      offset: PropTypes.number.isRequired,
    }).isRequired,
    SEARCH_REQUEST_TIMEOUT: PropTypes.number.isRequired,
  }).isRequired,
}
