import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';



const XmlImport = ({doImport}) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    doImport(event.target.result);
  }

  const doSubmit = (event) => {
    event.preventDefault();
    const file = document.getElementById('export-input').files[0];
    if (file) {
      reader.readAsText(file)
    }
  }

  return (
    <form onSubmit={doSubmit}>
      <div className='mb-3'>
        <label className='form-label' htmlFor='export-input'>Read Prospecting XML</label>
        <input className='form-control' type='file' id='export-input' />
      </div>
      <button
        className='btn btn-outline-primary'
      >
        <i className='bi bi-box-arrow-in-down me-1' />
        Load
      </button>
    </form>
  )
};

export default XmlImport;
