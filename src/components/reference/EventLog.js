import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import {numberFormat} from '../../utils';


const EventLog = ({events = []}) => {
  const [visible, setVisible] = useState(false);
  const style = visible ? {} : {display: 'none'};
  return (
    <div className='col mb-3'>
      <h3>
        Prospecting event log
        <button
          className='btn btn-sm btn-outline-secondary ms-2'
          onClick={() => setVisible(!visible)}
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      </h3>
      <table className='table' style={style}>
        <thead>
          <tr>
            <th scope='col'>Date</th>
            <th scope='col'>Location</th>
            <th scope='col'>Trace</th>
            <th scope='col'>Deposit</th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
            <tr>
              <td>{event.date}</td>
              <td>{`(${event.system.x},${event.system.y})`}</td>
              <td>{event.trace > 0 ? `${event.trace} away` : 'None'}</td>
              <td>{event.deposit ? `${numberFormat.format(event.deposit.size)} of ${event.deposit.type}` : 'None'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
};

export default EventLog;
