import React, {useState} from 'react';
import DepositSummaryRow from './DepositSummaryRow';

const MaterialsSummary = ({deposits = []}) => {
  const [visible, setVisible] = useState(true);
  const byType = deposits.reduce((rv, x) => {
    (rv[x.type] = rv[x.type] || []).push(x);
    return rv;
  }, {});
  return (
    <div className='container'>
      <h3>
        Found materials
        <button
          className='btn btn-sm btn-outline-secondary ms-2'
          onClick={() => setVisible(!visible)}
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      </h3>
      <table className='table' style={visible ? {} : {display: 'none'}}>
        <thead>
          <tr>
            <th>Type</th>
            <th>Total size</th>
            <th>Number of deposits</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {Object.keys(byType).map(matType => <DepositSummaryRow name={matType} deposits={byType[matType]} />)}
        </tbody>
      </table>
    </div>
  );
};

export default MaterialsSummary;
