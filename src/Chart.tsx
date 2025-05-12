'use client'

import { ChartInner } from './components/ChartInner'
import type { ChartProps, IndexedFlag } from './types'

import './style.css'
import 'uplot/dist/uPlot.min.css'
import { createContext } from 'react'
import { DEFAULT_COLOURS } from './constants'

export const ChartContext = createContext({
  colours: DEFAULT_COLOURS
})

export const Chart = ({ data, flags, plotColours }: ChartProps) => {
  const indexedFlags: IndexedFlag[] = (flags || []).map(f => ({
    ...f,
    seriesIndex: 1 + data.series.findIndex(x => x.name === f.seriesName)
  }))

  return (
    <ChartContext.Provider
      value={{ colours: plotColours || DEFAULT_COLOURS }}
    >
      <ChartInner data={data} flags={indexedFlags} />
    </ChartContext.Provider>
  )
}
