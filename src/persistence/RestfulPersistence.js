import axios from 'axios';
import AbstractPersistence from './AbstractPersistence';


const API_BASE = process.env.REACT_APP_API_BASE;

export default class RestfulPersistence extends AbstractPersistence {

  async save(uid, data) {
    return await axios.put(`${API_BASE}/asteroid-fields/${uid}`, data);
  }

  async get(uid) {
    return await axios.get(`${API_BASE}/asteroid-fields/${uid}`);
  }
}
