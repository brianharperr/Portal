import { useCallback } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import qs from "qs"

export const useQueryState = (query, number) => {
  const location = useLocation()
  const navigate = useNavigate()
  const setQuery = useCallback(
    value => {
      const existingQueries = qs.parse(location.search, {
        ignoreQueryPrefix: true,
      })

      if(value){
        value = value.toString();
      }

      const queryString = qs.stringify(
        { ...existingQueries, [query]: value },
        { skipNulls: true }
      )
      console.log(queryString);
      navigate(`${location.pathname}?${queryString}`)
    },
    [navigate, location, query]
  )
  let value = qs.parse(location.search, { ignoreQueryPrefix: true })[query];
  if(number){
    value = parseInt(value)
  }

  return [
    value,
    setQuery,
  ]
}