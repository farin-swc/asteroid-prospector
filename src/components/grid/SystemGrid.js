import React from 'react';
import './system-grid.css';
import {createGrid} from './grid';
import {numberFormat} from '../../utils';

const ICONS = {
  'Quantum': 'https://img.swcombine.com//materials/1/deposit.gif',
  'Meleenium': 'https://img.swcombine.com//materials/2/deposit.gif',
  'Rockivory': 'https://img.swcombine.com//materials/10/deposit.gif',
  'Varium': 'https://img.swcombine.com//materials/13/deposit.gif',
  'Hibridium': 'https://img.swcombine.com//materials/16/deposit.gif',
  'Ardanium': 'https://img.swcombine.com//materials/3/deposit.gif',
  'Duracrete': 'https://img.swcombine.com//materials/3/deposit.gif',
  'Varmigio': 'https://img.swcombine.com//materials/14/deposit.gif',
  'Lommite': 'https://img.swcombine.com//materials/15/deposit.gif',
  'Durelium': 'https://img.swcombine.com//materials/17/deposit.gif',
  'Rudic': 'https://img.swcombine.com//materials/4/deposit.gif',
  'Laboi': 'https://img.swcombine.com//materials/8/deposit.gif',
  'Adegan': 'https://img.swcombine.com//materials/9/deposit.gif',
  'Nova': 'https://img.swcombine.com//materials/12/deposit.gif',
  'Lowickan': 'https://img.swcombine.com//materials/18/deposit.gif',
  'Vertex': 'https://img.swcombine.com//materials/19/deposit.gif',
  'Berubian': 'https://img.swcombine.com//materials/20/deposit.gif'
};

const CellContent = ({cell}) => {
  const {asteroid, deposit, prospected, possibleTrace, depositExcluded} = cell;
  const content = deposit ?
    <img src={ICONS[deposit.type]} alt={deposit.type}
         title={`${numberFormat.format(deposit.size)} units of ${deposit.type}`} /> :
    prospected ? <span title='Prospected'>P</span> :
      depositExcluded ? <span title='Deposit excluded'>X</span> :
        possibleTrace ? <span title='Possible deposit'>{'?'.repeat(possibleTrace.length)}</span> : null;

  const classes = deposit ? 'bg-success' :
    prospected ? 'bg-danger' :
      depositExcluded ? 'bg-info' :
        possibleTrace ? 'bg-warning' :
          asteroid ? 'asteroid' : '';

  return (
    <td className={`grid-cell ${classes}`}>
      {content}
    </td>
  )
};

const SystemGrid = ({layout = '', deposits = [], events = []}) => {


  const grid = createGrid(layout, events, deposits);

  return (
    <>
      <table className='system-grid'>
        <thead>
          <tr>
            <th />
            {grid.map((row, idx) => <th>{idx}</th>)}
            <th />
          </tr>
        </thead>
        <tbody>
          {grid.map((row, idx) => (
            <tr>
              <td>{idx}</td>
              {row.map(cell => <CellContent cell={cell} />)}
              <td>{idx}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td />
            {grid.map((row, idx) => <th>{idx}</th>)}
            <td />
          </tr>
        </tfoot>
      </table>
      <ul className='list-group list-group-horizontal'>
        <li className='list-group-item bg-danger'>Prospected, no deposit</li>
        <li className='list-group-item bg-info'>No possible deposit</li>
        <li className='list-group-item bg-warning'>Possible deposit</li>
        <li className='list-group-item bg-success'>Deposit found</li>
      </ul>
    </>
  );

};

export default SystemGrid;
