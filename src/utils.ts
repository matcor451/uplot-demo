import uPlot from 'uplot'

import { Data, IndexedFlag } from './types'

export const invertHex = (hex: string) => {
  return '#' + (Number(`0x1${hex.replace('#', '')}`) ^ 0xFFFFFF).toString(16).substring(1).toUpperCase()
}

export const getFlagForPoint = (flags: IndexedFlag[], pointIndex: number) => {
  for (let i = 0; i < flags.length; i++) {
    const thisFlag = flags[i]
    if (thisFlag.endIndex === undefined) {
      if (thisFlag.pointIndex === pointIndex) return thisFlag.flag
    } else if (pointIndex >= thisFlag.pointIndex && pointIndex < thisFlag.endIndex) {
      return thisFlag.flag
    }
  }
}

export const seriesFromData = (data: Data, flags: IndexedFlag[], colours: string[]) => {
  const seriesArray = [{}]

  const applyFlag = (value: number | null, seriesIdx: number, pointIndex: number) => {
    if (value === null) return null
    const seriesFlags = flags.filter(x => x.seriesIndex === seriesIdx)
    const flag = getFlagForPoint(seriesFlags, pointIndex)
    if (flag) {
      return `${value} (${flag})`
    }
    return value
  }

  data.series.forEach((series, i) => {
    seriesArray.push({
      label: series.label || series.name,
      scale: 'y',
      value: (u: uPlot, v: number, seriesIdx: number, pointIndex: number) => applyFlag(v, seriesIdx, pointIndex),
      stroke: colours[i % colours.length]
    })
  })

  return seriesArray
}
