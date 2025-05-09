import uPlot from "uplot"
import { Flag } from "../page"

const COLOURS = ['#ff0000', '#0000ff', '#00ff00', '#ff00ff']

export const invertHex = (hex: string) => {
  return '#' + (Number(`0x1${hex.replace('#', '')}`) ^ 0xFFFFFF).toString(16).substring(1).toUpperCase()
}

export const getFlagForPoint = (flags: Flag[], pointIndex: number) => {
  for (let i = 0; i < flags.length; i++) {
    const thisFlag = flags[i]
    if (thisFlag.endIndex === undefined) {
      if (thisFlag.pointIndex === pointIndex) return thisFlag.flag
    }
    else if (pointIndex >=thisFlag.pointIndex && pointIndex < thisFlag.endIndex) {
      return thisFlag.flag
    }
  }
}

export const seriesFromData = (data: number[][], flags: Flag[]) => {
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

  data.slice(1).forEach((x, i) => {
    seriesArray.push({
      label: `Plot ${i}`,
      scale: 'y',
      // paths: () => null,
      // points: {
      //   space: 0,
      //   filter: //fn here to toggle flagged or not
      // },
      value: (u: uPlot, v: number, seriesIdx: number, pointIndex: number) => applyFlag(v, seriesIdx, pointIndex),
      stroke: COLOURS[i],
    })
  })

  return seriesArray
}
