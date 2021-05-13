import React from 'react';

const ProspectImport = ({doImport, disabled}) => {

  const doSubmit = (event) => {
    event.preventDefault();
    const prospectingInput = document.getElementById('prospecting-input');
    doImport(prospectingInput.value)
    prospectingInput.value = '';
  }

  return (
    <form onSubmit={doSubmit}>
      <div className='mb-3'>
        <label className='form-label' htmlFor='export-input'>Paste prospecting logs from event log</label>
        <textarea className='form-control' id='prospecting-input' />
      </div>
      <button
        type='submit'
        className='btn btn-outline-primary'
        disabled={disabled}
      >
        <i className='bi bi-box-arrow-in-down me-1' />
        Load
      </button>
    </form>
  )
};

export default ProspectImport;
