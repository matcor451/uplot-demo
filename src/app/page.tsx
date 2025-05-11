/* eslint-disable @typescript-eslint/no-unused-vars */
import { random, range } from 'lodash'

import { Chart } from './components/Chart'
import { Data, Flag } from './components/types'

const simpleData: Data = {
  xValues: [1, 2, 3, 4, 5],
  series: [
    { name: 'PARAM01', values: [10, 20, 30, 40, 50] },
    { name: 'PARAM02', values: [5, 4, 60, 20, 14] },
    { name: 'PARAM03', values: [46, 15, 43, 5, 27] },
    { name: 'PARAM04', values: [1, 2, 3, 4, 5] }
  ]
}

const bigData: Data = {
  xValues: range(500_000),
  series: [
    { name: 'TEMP', values: range(500_000).map(i => (10 + random(0, 5, true)) * Math.sin(i / 500)) },
    { name: 'PRES', values: range(500_000).map(i => 5 * Math.cos(i / 500)) }
  ]
}

export default function Home () {
  const flags: Flag[] = [
    { seriesName: 'PARAM01', pointIndex: 1, endIndex: 4, flag: 'X' }
  ]

  const data = simpleData
  // const data = bigData

  return (
    <div>
      <Chart
        data={data}
        flags={flags}
      />
    </div>
  )
}
