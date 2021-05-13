export function getKeys() {
  return JSON.parse(localStorage.getItem('keys')) || {};
}

export function storePassphrase(uuid, passphrase) {
  const keys = getKeys();
  keys[uuid] = passphrase;
  localStorage.setItem('keys', JSON.stringify(keys));
}

export function getPassphrase(uuid) {
  const keys = getKeys();
  return keys[uuid];
}

