import LocalStoragePersistence from './LocalStoragePersistence';

const localStorage = new LocalStoragePersistence();

export default function persistenceProvider() {
  return localStorage;
}

