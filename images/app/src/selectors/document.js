import { coalesce } from '../utils'
import { createSelector } from 'reselect'

export const activeLineSelector = state => {
  const { current, lines } = state.document

  if ( current >= 0 && current <= lines.length - 1 ) {
    return lines[current]
  }

  return ''
}

export const assignedTagsSelector = state => {
  const { current, tagged } = state.document
  const assigned = coalesce( tagged, current, [] )
  return new Set( assigned )
}
