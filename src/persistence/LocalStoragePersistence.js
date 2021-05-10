import AbstractPersistence from './AbstractPersistence';

export default class LocalStoragePersistence extends AbstractPersistence {

  save(uid, data) {
    localStorage.setItem(uid, JSON.stringify(data));
  }

  get(uid) {
    return JSON.parse(localStorage.getItem(uid));
  }

}
