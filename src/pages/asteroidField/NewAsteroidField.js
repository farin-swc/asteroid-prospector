import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import SystemGrid from '../../components/grid/SystemGrid';
import XmlImport from '../../components/import/XmlImport';
import EncryptionForm from '../../components/import/EncryptionForm';
import {extractDeposits, extractLayout, parseString, transformScansIntoEvents} from './xml';
import persistenceProvider from '../../persistence/persistenceProvider';
import cryptoProvider from '../../crypto/cryptoProvider';

const crypto = cryptoProvider();
const persistence = persistenceProvider();

const NewAsteroidField = () => {
  const [loaded, setLoaded] = useState(false);
  const [afData, setAfData] = useState({});
  const [credentials, setCredentials] = useState();
  const history = useHistory();

  const encryptAndPersist = async () => {
    const encrypted = await crypto.encrypt(credentials.passphrase, JSON.stringify(afData))
    persistence.save(credentials.uuid, encrypted);
    const keys = JSON.parse(localStorage.getItem('keys')) || {};
    keys[credentials.uuid] = credentials.passphrase;
    localStorage.setItem('keys', JSON.stringify(keys));
    history.push(`/asteroid-field/${credentials.uuid}`);
  }

  const doImportXml = (xmlString) => {
    if (!xmlString) {
      return;
    }
    const xml = parseString(xmlString);
    const layout = extractLayout(xml);
    const events = transformScansIntoEvents(xml);
    const deposits = extractDeposits(xml);
    setAfData({layout, events, deposits})
    setLoaded(false);
    (async () => {
      const credentials = await crypto.generateCredentials();
      setCredentials(credentials);
      setLoaded(true);
    })();
  }

  const encryptionForm = loaded && credentials && (
    <div className='row'>
      <div className='col mb-3'>
        <EncryptionForm uuid={credentials.uuid} passphrase={credentials.passphrase}
                        encryptAndSave={encryptAndPersist} />
      </div>
    </div>
  );

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col'>
          <SystemGrid layout={afData.layout} events={afData.events} deposits={afData.deposits} />
        </div>
        <div className='col'>
          <h3>New Asteroid Field</h3>
          <div className='row'>
            <div className='col mb-3'>
              <XmlImport doImport={doImportXml} />
            </div>
          </div>
          {encryptionForm}
        </div>
      </div>
    </div>
  )
}

export default NewAsteroidField;
