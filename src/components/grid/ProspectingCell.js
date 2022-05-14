import { numberFormat } from '../../utils';
import React from 'react';

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

const ProspectingCell = ({cell}) => {
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

export default ProspectingCell
