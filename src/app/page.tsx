import { Chart } from "./components/Chart";
import { random, range } from 'lodash'

export interface Flag {
  seriesIndex: number
  pointIndex: number
  endIndex?: number
  flag: string
}

const simpleData = [
  [1,2,3],
  [10,20,30],
  [5,4,60],
  [46,15,43],
  [1,2,3]
]

const bigData = [
  range(500_000),
  range(500_000).map(i => (10 + random(0, 5, true)) * Math.sin(i / 500)),
  range(500_000).map(i => 5 * Math.cos(i / 500)),
]

export default function Home() {
  const flags: Flag[] = [
    {seriesIndex: 1, pointIndex: 1, endIndex: 10_000, flag: 'X'}
  ]

  const data = simpleData
  // const data = bigData
  
  return (
    <div>
      <Chart data={data} flags={flags} />
    </div>
  );
}
