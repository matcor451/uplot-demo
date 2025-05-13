import { createContext } from 'react'

import { DEFAULT_COLOURS } from './constants'
import type { ChartContextValue } from './types'

export const ChartContext = createContext<ChartContextValue>({
  colours: DEFAULT_COLOURS,
  buttonClassname: ''
})
