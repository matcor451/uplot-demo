import { Chart } from "./components/Chart";
import { random, range } from 'lodash'

export interface Flag {
  seriesIndex: number
  pointIndex: number
  endIndex?: number
  flag: string
}

export const simpleData = [
  [1,2,3,4,5],
  [10,20,30,40,50],
  [5,4,60,20,14],
  [46,15,43, 5,27],
  [1,2,3,4,5]
]

export const bigData = [
  range(500_000),
  range(500_000).map(i => (10 + random(0, 5, true)) * Math.sin(i / 500)),
  range(500_000).map(i => 5 * Math.cos(i / 500)),
]

export default function Home() {
  const flags: Flag[] = [
    {seriesIndex: 1, pointIndex: 1, endIndex: 4, flag: 'X'}
  ]

  const data = simpleData
  // const data = bigData
  
  return (
    <div>
      <Chart data={data} flags={flags} />
    </div>
  );
}
