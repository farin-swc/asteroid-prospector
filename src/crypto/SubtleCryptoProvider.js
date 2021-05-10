import {v4 as uuidv4} from 'uuid';
import AbstractCryptoProvider from './AbstractCryptoProvider';

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const decrypt = async (iv, encryptedData, key) => {
  const string = atob(encryptedData);
  const uintArray = new Uint8Array(
    [...string].map((char) => char.charCodeAt(0))
  );

  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: new Uint8Array(iv).buffer
    },
    key,
    uintArray
  );
  return textDecoder.decode(decrypted);
}

const generateKey = async () => {
  return await window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256
    },
    true,
    ['encrypt', 'decrypt']
  );

}
const exportKey = async (key) => {
  return await window.crypto.subtle.exportKey('jwk', key);
}

const encrypt = async (data, key) => {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encodedData = textEncoder.encode(data);
  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv
    },
    key,
    encodedData
  );

  const uintArray = new Uint8Array(encryptedData);
  const string = String.fromCharCode.apply(null, uintArray);
  const base64Data = btoa(string);

  return {
    iv: Array.from(new Uint8Array(iv)),
    encryptedData: base64Data
  }
}

export default class SubtleCryptoProvider extends AbstractCryptoProvider {

  async generateCredentials() {
    const uuid = uuidv4();
    const key = await generateKey();
    const exported = await exportKey(key);
    return {
      uuid,
      passphrase: exported.k
    }
  }

  async encrypt(passphrase, data) {
    const key = await this.importKey(passphrase);
    return await encrypt(data, key);
  }

  async importKey(passphrase) {
    return await window.crypto.subtle.importKey(
      'jwk',
      {
        alg: 'A256GCM',
        ext: true,
        k: passphrase,
        key_ops: ['encrypt', 'decrypt'],
        kty: 'oct'
      },
      {name: 'AES-GCM'},
      true,
      ['encrypt', 'decrypt']
    );
  }

  async decrypt(passphrase, iv, data) {
    const key = await this.importKey(passphrase);
    return await decrypt(iv, data, key)
  }
}
