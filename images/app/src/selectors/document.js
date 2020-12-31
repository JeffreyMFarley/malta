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
  return coalesce( tagged, current, new Set() )
}

export const tokenizedLineSelector = createSelector(
  activeLineSelector,
  line => line.toLowerCase().replaceAll(
    /,\.'"\)\(/g, ''
  ).split( ' ' )
)
