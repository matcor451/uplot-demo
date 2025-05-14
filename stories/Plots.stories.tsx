import type { Meta, StoryObj } from '@storybook/react'
import { random, range } from 'lodash'

import { Chart } from '@/Chart'
import { Data } from '@/types'

import './styles.css'

const meta: Meta<typeof Chart> = {
  component: Chart
}

export default meta
type Story = StoryObj<typeof Chart>;

const simpleData: Data = {
  xValues: [11, 12, 13, 14, 15],
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

export const SmallDataset: Story = {
  args: {
    data: simpleData,
    flags: [{ seriesName: 'PARAM01', pointIndex: 1, endIndex: 4, flag: 'X' }]
  }
}

export const LargeDataset: Story = {
  args: {
    data: bigData
  }
}

export const CustomColours: Story = {
  args: {
    data: simpleData,
    plotColours: ['magenta', 'orange']
  }
}

export const CustomButtonStyle: Story = {
  args: {
    data: simpleData,
    buttonClassname: 'styled-button'
  }
}
