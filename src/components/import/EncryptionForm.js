import React from 'react';
import 'bootstrap/dist/css/bootstrap.css'

const EncryptionForm = ({uuid, passphrase, encryptAndSave}) => {

  const doSubmit = (event) => {
    event.preventDefault();
    encryptAndSave();
  }

  return (
    <form onSubmit={doSubmit}>
      <div className='mb-3'>
        <label htmlFor='af-uuid' className='form-label'>Asteroid Field Unique Identifier</label>
        <input type='text' className='form-control' id='af-uuid' aria-describedby='uuid-help' disabled value={uuid} />
        <div id='uuid-help' className='form-text'>
          This character sequence identifies your AF data. You may think of it like login needed to access your data. It will
          be saved in your browser storage. You are strongly encouraged to save it somewhere else in case you clear your
          browser data or want to share this AF with friends. <span className='text-danger'>There is no way to recover it.</span>
        </div>
      </div>
      <div className='mb-3'>
        <label htmlFor='af-passphrase' className='form-label'>Asteroid Field Encryption Passphrase</label>
        <input type='text' className='form-control' id='af-passphrase' aria-describedby='passphrase-help' disabled value={passphrase}/>
        <div id='passphrase-help' className='form-text'>
          This character sequence encrypts and decrypts your AF data. You may think of it as password needed to access
          your data. It will be saved in your browser storage. You are strongly encouraged to save it somewhere else in case you clear your
          browser data or want to share this AF with friends. <span className='text-danger'>There is no way to recover it.</span>
        </div>
      </div>
      <div className='mb-3'>
        <button
          type='submit'
          className='btn btn-outline-primary'
        >
          <i className='bi bi-box-arrow-up me-1' />
          Encrypt and send
        </button>
      </div>
    </form>

  )
}

export default EncryptionForm;
