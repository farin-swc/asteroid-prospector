export default class AbstractCryptoProvider {

  generateCredentials() {
    throw new Error('Not Supported');
  }

  encrypt(passphrase, data) {
    throw new Error('Not Supported');
  }

  decrypt(passphrase, iv, data) {
    throw new Error('Not Supported');
  }



}
