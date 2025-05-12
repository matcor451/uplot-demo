import uPlot from 'uplot'

export const onKeyDown = (u: uPlot) => (e: KeyboardEvent) => {
  e.preventDefault()
  // const xStep = 0.5
  const xStep = (u.scales.x.max! - u.scales.x.min!) * 0.1
  // const yStep = 2
  const yStep = (u.scales.y.max! - u.scales.y.min!) * 0.1
  if (e.key === 'ArrowLeft') {
    u.setScale('x', { min: u.scales.x.min! - xStep, max: u.scales.x.max! - xStep })
    u.setScale('y', { min: u.scales.y.min!, max: u.scales.y.max! })
  } else if (e.key === 'ArrowRight') {
    u.setScale('x', { min: u.scales.x.min! + xStep, max: u.scales.x.max! + xStep })
    u.setScale('y', { min: u.scales.y.min!, max: u.scales.y.max! })
  } else if (e.key === 'ArrowUp') {
    u.setScale('y', { min: u.scales.y.min! + yStep, max: u.scales.y.max! + yStep })
  } else if (e.key === 'ArrowDown') {
    u.setScale('y', { min: u.scales.y.min! - yStep, max: u.scales.y.max! - yStep })
  }
}
