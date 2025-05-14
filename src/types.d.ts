export interface FlaggedPoint {
  seriesName: string
  pointIndex: number
  endIndex?: number
  flag: string
}

export interface IndexedFlaggedPoint extends FlaggedPoint {
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
  flags?: FlaggedPoint[]
  plotColours?: string[]
  buttonClassname?: string
  flagCallback?: (flags: FlaggedPoint[]) => void
}

export interface InnerChartProps extends ChartProps {
  data: Data
  flags: IndexedFlaggedPoint[]
}

export interface ChartContextValue {
  colours: string[]
  buttonClassname: string
}

export interface ISelectedPoints {
  [seriesIndex: number]: number[] // array of point indices
}
