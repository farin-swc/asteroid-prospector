import SubtleCryptoProvider from './SubtleCryptoProvider';
import NoCryptoProvider from './NoCryptoProvider';

const subtleCrypto = new SubtleCryptoProvider();
const noCrypto = new NoCryptoProvider();

export default function cryptoProvider() {
  return process.env.REACT_APP_ENCRYPTION === 'subtle' ? subtleCrypto : noCrypto;
}
