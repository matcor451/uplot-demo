export interface Flag {
  seriesName: string
  pointIndex: number
  endIndex?: number
  flag: string
}

export interface IndexedFlag extends Flag {
  seriesIndex: number
}

export interface DataSeries {
  name: string
  label?: string // if no label provided then name is used
  values: number[]
}

export interface Data {
  xValues: number[]
  series: DataSeries[]
}

export interface ChartProps {
  data: Data
  flags: Flag[]
}

export interface InnerChartProps {
  data: Data
  flags: IndexedFlag[]
}
