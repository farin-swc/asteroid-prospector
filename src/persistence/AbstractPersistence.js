export default class AbstractPersistence {

  save(uid, data) {
    throw new Error('Not Supported');
  }

  get(uid) {
    throw new Error('Not Supported');
  }

}
