import React from 'react';
import SystemGrid from '../../components/grid/SystemGrid';
import { createGrid } from '../../components/grid/grid';
import { calculateSensors } from '../../vision/sensors';

const SensorsCell = ({cell}) => {
  return (
    <td className={`grid-cell ${cell.asteroid ? 'asteroid' : ''}`}>
      {cell.sensors}
    </td>
  )
}

const Sensors = () => {

  const afData = {"layout":".a..a.a.aa...a...aa.......aa..aaaa.....aaaa.aa.a.aaaaa.a.a.a.aaaaa..aaaaaaaaaaa...aa....a.aaaa..aaaaa..a.a..aaaaaaa.aaaa.aa.aa..aaa.aaa....aaaaaaa..aaaaaaaa.a.a...aaaa.aaaaaaaa..aa...aaaa.a.aaaaaa.aa...a.aaa.a.aaaaaa.aaaaaaa.....aaaaaaa.aaaaaaaa.aaaaaaaaaa...aa.aa.aaaaaaaaaaaa...a...aaaaaaaaaaaaa.aa..aaaaaaaaaaaaaaa.......aaaa..aaaaaaaaaa.....aa.a..aaaaaa....aa.aaaaa...aaaaaaa.a.a..a..a...a..a.aa."}

  const startingPoint = {x: 13, y: 13};
  const sensors = 21;

  const gridData = createGrid(afData.layout);

  gridData.forEach((row, rowIdx) => {
    row.forEach((cell, cellIdx) => {
      gridData[rowIdx][cellIdx].sensors = calculateSensors({x: cellIdx, y: rowIdx}, startingPoint, sensors, gridData)
    })
  })

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col'>
          <SystemGrid gridData={gridData} showLabels={false} cellComponent={SensorsCell} />
        </div>
        <div className='col'>
          <h3>Asteroid Field Sensors Calculator</h3>
          <div className='row'>
            <div className='col mb-3'>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sensors;
