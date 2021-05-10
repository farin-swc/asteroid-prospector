import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import {numberFormat} from '../../utils';

const DepositSummaryRow = ({deposits, name}) => {
  const [visible, setVisible] = useState(false);
  const total = deposits.reduce((sum, x) => sum + x.size, 0);

  return (
    <React.Fragment>
      <tr>
        <td>{name}</td>
        <td>{numberFormat.format(total)}</td>
        <td>{deposits.length}</td>
        <td>
          <button
            className='btn btn-sm btn-outline-secondary ms-2'
            onClick={() => setVisible(!visible)}
          >
            {visible ? 'Hide' : 'Show'} details
          </button>
        </td>
      </tr>
      <tr style={visible ? {} : {display: 'none'}}>
        <td colSpan='4'>
          <table className='table'>
            <thead>
              <th>Location</th>
              <th>Size</th>
            </thead>
            <tbody>
              {deposits.map(deposit => (
                <tr>
                  <td>({deposit.x},{deposit.y})</td>
                  <td>{numberFormat.format(deposit.size)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </td>
      </tr>
    </React.Fragment>
  );

};

export default DepositSummaryRow;
