import React, {useEffect, useState} from 'react';
import {Redirect, useParams} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import persistenceProvider from '../../persistence/persistenceProvider';
import SystemGrid from '../../components/grid/SystemGrid';
import XmlImport from '../../components/import/XmlImport';
import ProspectImport from '../../components/import/ProspectImport';
import MaterialsSummary from '../../components/reference/MaterialsSummary';
import EventLog from '../../components/reference/EventLog';
import {extractDeposits, parseString, transformScansIntoEvents} from './xml';
import {parseProspectingLog} from './parsers';
import cryptoProvider from '../../crypto/cryptoProvider';


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

const PersistedAsteroidField = () => {
  const [afData, setAfData] = useState({});
  const [redirect, setRedirect] = useState();
  const [passphrase, setPassphrase] = useState();

  const {uid} = useParams();

  useEffect(() => {
    const persisted = persistence.get(uid);
    if (!persisted) {
      setRedirect('/asteroid-field/new')
    } else {
      (async () => {
        const key = JSON.parse(localStorage.getItem('keys'))[uid];
        const newData = await crypto.decrypt(key, persisted.iv, persisted.encryptedData);
        setPassphrase(key);
        setAfData(JSON.parse(newData));
      })();
    }
  }, [uid]);

  if (redirect) {
    return <Redirect to={redirect} />
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
    newAfData.events = mergeEvents(afData.events, events);
    const encrypted = await crypto.encrypt(passphrase, JSON.stringify(newAfData));
    persistence.save(uid, encrypted);
    setAfData(newAfData);
  }

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col'>
          <SystemGrid layout={afData.layout} events={afData.events} deposits={afData.deposits} />
        </div>
        <div className='col'>
          <h3>Import data</h3>
          <div className='row'>
            <div className='col'>
              <XmlImport doImport={readXml} />
            </div>
            <div className='col'>
              <ProspectImport doImport={readProspectingLog} />
            </div>
          </div>
          <div className='row'>
            <MaterialsSummary deposits={afData.deposits} />
          </div>
          <div className='row'>
            <EventLog events={afData.events} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PersistedAsteroidField;
