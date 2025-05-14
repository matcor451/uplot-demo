import React, { useContext, useEffect, useRef, useState } from 'react'

import type uPlot from 'uplot'
import type { Options } from 'uplot'
import UplotReact from 'uplot-react'

import { Button } from './Button'
import { onKeyDown } from '../eventHandlers'
import { seriesPointsPlugin } from '../plugins'
import type { IndexedFlaggedPoint, ISelectedPoints, InnerChartProps } from '../types'
import { seriesFromData } from '../utils'
import { ChartContext } from '@/ChartContext'
import { FLAGS } from '@/constants'

const initHook = (u: uPlot, flagMode: boolean) => {
  u.over.tabIndex = -1 // required for key handlers

  if (flagMode) {
    u.root.querySelector('.u-select')?.classList.add('flag-select')
  }

  u.over.addEventListener(
    'keydown',
    onKeyDown(u),
    true
  )
}

export const ChartInner = ({ data, flags, flagCallback }: InnerChartProps) => {
  const [flagMode, setFlagMode] = useState(false)

  const { colours: plotColours } = useContext(ChartContext)

  const containerDiv = useRef<HTMLDivElement>(null)
  const plotRef = useRef<uPlot>(null)
  const flagSelect = useRef<HTMLSelectElement>(null)

  useEffect(() => {
    const handleResize = () => {
      if (plotRef.current && containerDiv.current) {
        plotRef.current.setSize({
          width: containerDiv.current?.clientWidth,
          height: plotRef.current.height
        })
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize() // Call now to set initial size
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    if (!flagMode) {
      clearSelection()
    }
  }, [flagMode])

  const toggleDark = () => {
    if (!containerDiv.current) return
    if (containerDiv.current.className.includes('dark-mode')) {
      containerDiv.current.classList.remove('dark-mode')
    } else {
      containerDiv.current.classList.add('dark-mode')
    }
  }

  const series = seriesFromData(data, flags, plotColours)

  const applyFlags = () => {
    if (!plotRef.current) return
    const u = plotRef.current
    const lft = u.select.left
    const rgt = u.select.width + lft
    const top = u.select.top
    const bottom = u.select.height + top

    const leftIdx = u.posToIdx(lft)
    const rightIdx = u.posToIdx(rgt)
    const topVal = u.posToVal(top, 'y')
    const bottomVal = u.posToVal(bottom, 'y')

    const pointsToFlag: ISelectedPoints = {}
    u.data.slice(1).forEach((x, seriesIndex) => {
      pointsToFlag[seriesIndex] = []
      for (let i = leftIdx; i <= rightIdx; i++) {
        const xPos = u.valToPos(u.data[0][i], 'x')
        if (xPos < lft || xPos > rgt) continue
        const val = x[i]
        if (val === undefined || val === null) continue
        if (val >= bottomVal && val <= topVal) {
          pointsToFlag[seriesIndex].push(i)
        }
      }
    })
    const flag = flagSelect.current?.value
    const updatedFlags: IndexedFlaggedPoint[] = [...flags]
    if (flag) {
      Object.keys(pointsToFlag).forEach(idx => {
        const seriesIndex = Number(idx)
        const seriesName = data.series[seriesIndex].name
        pointsToFlag[seriesIndex].forEach(pointIndex => {
          updatedFlags.push({
            seriesIndex,
            seriesName,
            pointIndex,
            flag
          })
        })
      })
    }
    if (flagCallback) {
      flagCallback(updatedFlags)
    }
  }

  const clearSelection = () => {
    if (plotRef.current) {
      plotRef.current.setSelect({ left: 0, top: 0, width: 0, height: 0 })
      plotRef.current.root.querySelector('.u-select')?.classList.remove('flag-select')
    }
  }

  const opts: Options = {
    width: containerDiv.current ? containerDiv.current.clientWidth : 800,
    height: 600,
    cursor: {
      drag: {
        setScale: !flagMode,
        x: true,
        y: true
      },
      hover: {
        prox: 5,
        bias: 0
      },
      bind: {
        mousedown: (u, _target, handler) => {
          return e => {
            handler(e)
            if (e.button === 0) {
              if (flagMode) {
                u.root.querySelector('.u-select')?.classList.add('flag-select')
              }
            }
            return null
          }
        },
        dblclick: (u, _target, handler) => {
          return e => {
            handler(e)
            u.root.querySelector('.u-select')?.classList.remove('flag-select')
            return null
          }
        }
      }
    },
    hooks: {
      init: [(u) => initHook(u, flagMode)]
      // setSelect: flagMode ? [onFlag] : []
    },
    plugins: [
      seriesPointsPlugin(flags)
    ],
    series,
    scales: {
      x: {
        time: false,
        min: plotRef.current ? plotRef.current.scales.x.min : undefined,
        max: plotRef.current ? plotRef.current.scales.x.max : undefined
      },
      y: {
        min: plotRef.current ? plotRef.current.scales.y.min : undefined,
        max: plotRef.current ? plotRef.current.scales.y.max : undefined
      }
    },
    select: plotRef.current ? plotRef.current.select : undefined,
    axes: [
      {},
      { scale: 'y' }
    ]
  }

  const onUnZoom = () => {
    const u = plotRef.current
    if (!u) return
    u.setScale('x', { min: u.data[0][0], max: u.data[0][u.data[0].length - 1] })
  }

  return (
    <div
      ref={containerDiv}
      style={{ width: '100%' }}
    >
      {/* Control bar */}
      <div>
        <Button onClick={() => setFlagMode(!flagMode)}>
          Toggle Flag Mode - {flagMode ? 'on' : 'off'}
        </Button>
        <Button onClick={onUnZoom}>
          Reset Zoom
        </Button>
        <Button onClick={toggleDark}>
          Toggle Dark Mode
        </Button>
      </div>
      <div>
        {flagMode &&
          <div>
            <select ref={flagSelect}>
              <option></option>
              {FLAGS.map(x => <option key={x}>{x}</option>)}
            </select>
            <Button onClick={applyFlags}>Apply flags</Button>
            <Button onClick={clearSelection}>clear selection</Button>
          </div>
        }
      </div>
      {/* End control bar  */}

      <UplotReact
        options={opts}
        data={[
          data.xValues,
          ...data.series.map(s => s.values)
        ]}
        onCreate={(chart) => { plotRef.current = chart }}
      />
    </div>
  )
}
