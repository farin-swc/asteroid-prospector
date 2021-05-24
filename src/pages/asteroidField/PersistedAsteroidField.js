import React, {useEffect, useState} from 'react';
import {Redirect, useParams} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import persistenceProvider from '../../persistence/persistenceProvider';
import SystemGrid from '../../components/grid/SystemGrid';
import MaterialsSummary from '../../components/reference/MaterialsSummary';
import EventLog from '../../components/reference/EventLog';
import {extractDeposits, parseString, transformScansIntoEvents} from './xml';
import {parseProspectingLog} from './parsers';
import cryptoProvider from '../../crypto/cryptoProvider';
import AsteroidFieldControls from '../../components/import/AsteroidFieldControls';
import {getPassphrase, storePassphrase} from '../../persistence/keyStorage';


const AWAITING_AF_DATA = 'awaiting-af-data';
const AWAITING_KEY = 'awaiting-key';
const INVALID_KEY = 'invalid-key';
const INVALID_AF_UUID = 'invalid-af-uuid';
const AF_DECRYPTED = 'af-decrypted';

const persistence = persistenceProvider();
const crypto = cryptoProvider();

const mergeEvents = (existingEvents, newEvents) => {
  const mapToTimeSpace = event => `${event.date}@(${event.system.x},${event.system.y})`;
  const existing = {}
  existingEvents.map(mapToTimeSpace).forEach(ts => existing[ts] = true)
  return [
    ...existingEvents,
    ...(newEvents.filter(event => !existing[mapToTimeSpace(event)]))
  ].sort((a, b) => a.date.localeCompare(b.date))
}

const notIncludedInExisting = (deposits) => (e) => {
  return !deposits.find(existing => (e.system.x === existing.x && e.system.y === existing.y));
}

const PersistedAsteroidField = () => {
  const [afData, setAfData] = useState({});
  const [uiState, setUiState] = useState(AWAITING_AF_DATA);
  const [fetchedData, setFetchedData] = useState();
  const [passphrase, setPassphrase] = useState();

  const {uid} = useParams();

  useEffect(() => {
    persistence.get(uid)
      .catch(() => setUiState(INVALID_AF_UUID))
      .then(({data: persisted}) => {
      setFetchedData(persisted);
      const key = getPassphrase(uid);
      if (!key) {
        setUiState(AWAITING_KEY);
      } else {
        attemptDecryption(key, persisted);
      }
    });

  }, [uid]);

  function attemptDecryption(key, persisted) {
    crypto.decrypt(key, persisted.iv, persisted.encryptedData).then(newData => {
      setPassphrase(key);
      storePassphrase(uid, key);

      const parsed = JSON.parse(newData);

      // make sure that already stored data affected by bug is fixed
      parsed.deposits = [
        ...parsed.deposits,
        ...parsed.events
          .filter(e => e.deposit)
          .filter(notIncludedInExisting(parsed.deposits))
          .map(e => ({...e.system, ...e.deposit}))
      ];

      setAfData(parsed);
      setUiState(AF_DECRYPTED);
    }).catch((e) => {
      console.error(e);
      setUiState(INVALID_KEY)
    });
  }


  const readXml = async (xmlString) => {
    const xml = parseString(xmlString);
    const events = transformScansIntoEvents(xml);
    const deposits = extractDeposits(xml);
    const newAfData = {...afData};
    newAfData.deposits = deposits;
    newAfData.events = mergeEvents(afData.events, events);
    const encrypted = await crypto.encrypt(passphrase, JSON.stringify(newAfData));
    persistence.save(uid, encrypted);
    setAfData(newAfData);
  }

  const readProspectingLog = async (log) => {
    const events = parseProspectingLog(log);
    const newAfData = {...afData};
    const deposits = events.filter(event => event.deposit)
      .filter(notIncludedInExisting(newAfData.deposits))
      .map(event => event.deposit);
    newAfData.deposits = [...newAfData.deposits, ...deposits];
    newAfData.events = mergeEvents(afData.events, events);
    const encrypted = await crypto.encrypt(passphrase, JSON.stringify(newAfData));
    persistence.save(uid, encrypted);
    setAfData(newAfData);
  }

  if (uiState === INVALID_AF_UUID) {
    return <Redirect to='/asteroid-field/new' />
  }

  const awaitingKey =
    <div className='mt-3'>
      {uiState === INVALID_KEY ?
        <div className="alert alert-danger" role="alert">
          Invalid passphrase
        </div>
        : null
      }
      <label className='form-label' htmlFor='passphrase'>
        Please paste your encryption passphrase below
      </label>
      <input id='passphrase' className='form-control' />
      <button
        className='btn btn-sm btn-outline-primary mt-3'
        onClick={() => {
          attemptDecryption(document.getElementById('passphrase').value, fetchedData);
        }}
      >
        Decrypt
      </button>
    </div>

  const decrypted = <>
    <div className='row'>
      <AsteroidFieldControls
        disabled={uiState !== AF_DECRYPTED} importXml={readXml} importEvents={readProspectingLog}
      />
    </div>
    <div className='row'>
      <MaterialsSummary deposits={afData.deposits} />
    </div>
    <div className='row'>
      <EventLog events={afData.events} />
    </div>
  </>;


  return (
    <div className='container-fluid '>
      <div className='row'>
        <div className='col'>
          <SystemGrid layout={afData.layout} events={afData.events} deposits={afData.deposits} />
        </div>
        <div className='col me-3'>
          {[AWAITING_KEY, INVALID_KEY].includes(uiState) ? awaitingKey :
            uiState === AF_DECRYPTED ? decrypted : null
          }
        </div>
      </div>
    </div>
  )
}

export default PersistedAsteroidField;
