'use client'

import { ChartInner } from './components/ChartInner'
import type { ChartProps, IndexedFlag } from './types'

import './style.css'
import 'uplot/dist/uPlot.min.css'

export const Chart = ({ data, flags }: ChartProps) => {
  const indexedFlags: IndexedFlag[] = flags.map(f => ({
    ...f,
    seriesIndex: 1 + data.series.findIndex(x => x.name === f.seriesName)
  }))

  return (
    <ChartInner data={data} flags={indexedFlags} />
  )
}
