'use client'
import React, { useEffect, useRef, useState } from 'react';
import uPlot, { AlignedData, Options } from 'uplot';
import UplotReact from 'uplot-react';
import 'uplot/dist/uPlot.min.css';
// import './style.css'
import { seriesFromData } from './utils';
import { seriesPointsPlugin } from './plugins';
import { Flag } from '../page';

interface Props {
  data: number[][]
  flags: Flag[]
}

const initHook = (u: uPlot) => {
  u.over.tabIndex = -1; // required for key handlers

  u.over.addEventListener(
    "keydown",
    (e) => {
      const xStep = 2000
      const yStep = 2
      if (e.key === "ArrowLeft") {
        u.setScale('x', {min: u.scales.x.min! - xStep, max: u.scales.x.max! - xStep})
      } else if (e.key === "ArrowRight") {
        u.setScale('x', {min: u.scales.x.min! + xStep, max: u.scales.x.max! + xStep})
      } else if (e.key === 'ArrowUp') {
        u.setScale('%', {min: u.scales['%'].min! + yStep, max: u.scales['%'].max! + yStep})
      } else if (e.key === 'ArrowDown') {
        u.setScale('%', {min: u.scales['%'].min! - yStep, max: u.scales['%'].max! - yStep})
      }
    },
    true
  );
}

export const Chart = ({ data, flags }: Props) => {
  const [flagMode, setFlagMode] = useState(false)

  const containerDiv = useRef<HTMLDivElement>(null)

  const toggleDark = () => {
    if (!containerDiv.current) return
    if (containerDiv.current.className.includes('invert')) {
      containerDiv.current.className = 'w-full'
    } else {
      containerDiv.current.className = 'w-full bg-[#ededed] invert'
    }
    
  }

  const series = seriesFromData(data, flags)

  const onFlag = [(u: uPlot) => {
    const lft = u.select.left;
    const rgt = u.select.width + lft;
    const top = u.select.top
    const bottom = u.select.height + top

    const leftIdx = u.posToIdx(lft);
    const rightIdx = u.posToIdx(rgt);
    const topVal = u.posToVal(top, '%')
    const bottomVal = u.posToVal(bottom, '%')

    // console.log('select range:')
    // console.log('x:', u.data[0][leftIdx], u.data[0][rightIdx])
    // console.log('y:', bottomVal, topVal)

    const pointsToFlag: number[][] = []
    u.data.slice(1).forEach(x => {
      for (let i = leftIdx; i <= rightIdx; i++) {
        const xPos = u.valToPos(i+1, 'x')
        if (xPos < lft || xPos > rgt) continue
        const val = x[i]
        if (val === undefined || val === null) continue
        if (val >= bottomVal && val <= topVal) {
          pointsToFlag.push([i, val])
        }
      }
    })
    console.log(pointsToFlag)
  }]

  const opts: Options = {
    title: "Test Plot",
    width: 800,
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
        mousedown: (u, targ, handler) => {
          return e => {
            handler(e)
            if (e.button == 0) {
              if (flagMode) {
                u.root.querySelector(".u-select")?.classList.add('border', 'border-dashed');
              }
            }
          }
        },
        dblclick: (u, targ, handler) => {
          return e => {
            handler(e)
            u.root.querySelector(".u-select")?.classList.remove('border', 'border-dashed');
          }
        }
      }
    },
    hooks: {
      init: [initHook],
      setSelect: flagMode ? onFlag : [],
    },
    plugins: [
      seriesPointsPlugin(flags)
    ],
    series: series,
    scales: {
      x: {
        time: false,
        // min: data[0][0] - 0.25,
        // max: data[0].slice(-1)[0] + 0.25
      }
    },
    axes: [
      {},
      {
        scale: "%",
        values: (u, vals) => vals.map(v => +v.toFixed(1) + "%"),
      }
    ],
  };

  return (
      <div
        ref={containerDiv}
        className='w-full'
      >
        <button
          className='border-2 cursor-pointer'
          onClick={() => setFlagMode(!flagMode)}
        >
          Toggle Flag Mode - {flagMode ? 'on' : 'off'}
        </button>
        <button className='border-2 cursor-pointer' onClick={toggleDark}>
          Toggle Dark Mode
        </button>
        {flagMode &&
          <button className='border-2 cursor-pointer' onClick={() => {
            const event = new MouseEvent('dblclick', {
              'view': window,
              'bubbles': true,
              'cancelable': true
            });
            document.getElementsByClassName('u-over')[0].dispatchEvent(event)
            }}
          >
            clear selection
          </button>
        }
        <UplotReact
          options={opts}
          data={data as AlignedData}
          // target={target}
          // onCreate={(chart) => {}}
          // onDelete={(chart) => {}}
          // resetScales={true}
        />
      </div>
  );
}