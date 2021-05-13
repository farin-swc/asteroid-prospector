import React, {useState} from 'react';
import XmlImport from './XmlImport';
import ProspectImport from './ProspectImport';

const AsteroidFieldControls = ({disabled, importXml, importEvents}) => {

  const [xmlActive, setXmlActive] = useState(true);

  return (
    <React.Fragment>
      <div className='row'>
        <h3>
          Import data
          <div className='btn-group ms-3' role='group'>
            <button
              type='button' onClick={() => setXmlActive(true)}
              className={`btn btn-sm btn-outline-primary ${xmlActive ? 'active' : ''}`}
            >
              Import XML
            </button>
            <button
              type='button' onClick={() => setXmlActive(false)}
              className={`btn btn-sm btn-outline-primary ${!xmlActive ? 'active' : ''}`}
            >
              Import Events
            </button>
          </div>
        </h3>
      </div>
      <div className='row mb-3'>
        {xmlActive ?
          <XmlImport doImport={importXml} disabled={disabled} />
          :
          <ProspectImport doImport={importEvents} disabled={disabled} />
        }
      </div>
    </React.Fragment>
  )
};

export default AsteroidFieldControls;
