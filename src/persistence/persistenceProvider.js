import LocalStoragePersistence from './LocalStoragePersistence';
import RestfulPersistence from './RestfulPersistence';

const localStorage = new LocalStoragePersistence();
const restful = new RestfulPersistence();

export default function persistenceProvider() {
  return process.env.REACT_APP_PERSISTENCE === 'REST' ? restful : localStorage;
}

