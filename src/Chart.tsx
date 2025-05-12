'use client'
import { createContext } from 'react'

import { ChartInner } from './components/ChartInner'
import { DEFAULT_COLOURS } from './constants'
import type { ChartContextValue, ChartProps, IndexedFlag } from './types'

import './style.css'
import 'uplot/dist/uPlot.min.css'

export const ChartContext = createContext<ChartContextValue>({
  colours: DEFAULT_COLOURS,
  buttonClassname: ''
})

export const Chart = ({ data, flags, ...props }: ChartProps) => {
  const indexedFlags: IndexedFlag[] = (flags || []).map(f => ({
    ...f,
    seriesIndex: 1 + data.series.findIndex(x => x.name === f.seriesName)
  }))

  return (
    <ChartContext.Provider
      value={{
        colours: props.plotColours || DEFAULT_COLOURS,
        buttonClassname: props.buttonClassname || ''
      }}
    >
      <ChartInner data={data} flags={indexedFlags} />
    </ChartContext.Provider>
  )
}
