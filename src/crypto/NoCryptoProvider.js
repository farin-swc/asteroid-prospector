import AbstractCryptoProvider from './AbstractCryptoProvider';

export default class NoCryptoProvider extends AbstractCryptoProvider {

  async generateCredentials() {
    return {
      uuid: '',
      passphrase: ''
    }
  }

  async encrypt(passphrase, data) {
    return JSON.parse(data);
  }

  async decrypt(passphrase, iv, data) {
    return {iv, data};
  }
}
