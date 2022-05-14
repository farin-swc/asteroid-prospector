import React from 'react';
import './system-grid.css';
import ProspectingCell from './ProspectingCell';

const SystemGrid = (
  {
    gridData,
    showLabels = true,
    cellComponent = ProspectingCell
  }
) => {


  return (
    <>
      <table className='system-grid'>
        <thead>
          <tr>
            <th />
            {gridData.map((row, idx) => <th>{idx}</th>)}
            <th />
          </tr>
        </thead>
        <tbody>
          {gridData.map((row, idx) => (
            <tr>
              <td>{idx}</td>
              {row.map(cell => cellComponent({cell}))}
              <td>{idx}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td />
            {gridData.map((row, idx) => <th>{idx}</th>)}
            <td />
          </tr>
        </tfoot>
      </table>
      {showLabels && <ul className='list-group list-group-horizontal'>
        <li className='list-group-item bg-danger'>Prospected, no deposit</li>
        <li className='list-group-item bg-info'>No possible deposit</li>
        <li className='list-group-item bg-warning'>Possible deposit</li>
        <li className='list-group-item bg-success'>Deposit found</li>
      </ul>}
    </>
  );

};

export default SystemGrid;
