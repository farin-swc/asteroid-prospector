import AbstractPersistence from './AbstractPersistence';

export default class LocalStoragePersistence extends AbstractPersistence {

  async save(uid, data) {
    return new Promise(() => localStorage.setItem(uid, JSON.stringify(data)));
  }

  async get(uid) {
    return new Promise(() => JSON.parse(localStorage.getItem(uid)));
  }

}
