import { ChartContext } from './ChartContext'
import { ChartInner } from './components/ChartInner'
import { DEFAULT_COLOURS } from './constants'
import type { ChartProps, IndexedFlag } from './types'

import './style.css'
import 'uplot/dist/uPlot.min.css'

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
