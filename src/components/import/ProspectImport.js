import React from 'react';

const ProspectImport = ({doImport}) => {
  return (
    <div className='col mb-3'>
      <div className='mb-3'>
        <label className='form-label' htmlFor='export-input'>Paste prospecting logs from event log</label>
        <textarea className='form-control' id='prospecting-input' />
      </div>
      <button
        type='button'
        className='btn btn-outline-primary'
        onClick={() => {
          const prospectingInput = document.getElementById('prospecting-input');
          doImport(prospectingInput.value)
          prospectingInput.value = '';
        }}
      >
        <i className='bi bi-box-arrow-in-down me-1' />
        Load
      </button>
    </div>
  )
};

export default ProspectImport;
