import SubtleCryptoProvider from './SubtleCryptoProvider';

const subtleCrypto = new SubtleCryptoProvider();

export default function cryptoProvider() {
  return subtleCrypto;
}
