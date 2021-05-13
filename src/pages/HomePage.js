import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import {Link} from 'react-router-dom';
import {getKeys} from '../persistence/keyStorage';

const HomePage = () => {
  const keysById = getKeys();

  return (
    <div className='container'>
      <h2 className='my-3'>Locally stored Asteroid Fields</h2>

      <ul>
        {
          Object.keys(keysById).map(id => (
            <li key={id}><Link to={`/asteroid-field/${id}`}>{id}</Link></li>
          ))
        }
      </ul>
    </div>
  )
};

export default HomePage;
