import CryptoJS from 'crypto-js';
import { useState, useEffect } from 'react';

export function useLocalStorageStateWithEncryption(
  initialState,
  key,
  secretKey
) {
  const [value, setValue] = useState(initialState);

  useEffect(() => {
    if (!secretKey) return;
    const storedValueToDecrypt = localStorage.getItem(key);
    if (!storedValueToDecrypt) return;
    const bytes = CryptoJS.AES.decrypt(storedValueToDecrypt, secretKey);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    console.log('Before decrypt', storedValueToDecrypt);
    console.log('After decrypt', decryptedData);
    setValue(decryptedData ? decryptedData : initialState);
  }, [secretKey, key, initialState]);

  useEffect(() => {
    if (!secretKey || !value) return;
    const valueToStore = value ? JSON.stringify(value) : null;
    const encryptedData = valueToStore
      ? CryptoJS.AES.encrypt(valueToStore, secretKey).toString()
      : null;
    localStorage.setItem(key, encryptedData);
    console.log('Before encrypt', valueToStore);
    console.log('After encrypt', encryptedData);
  }, [value, key, secretKey]);

  return [value, setValue];
}

export function useLocalStorageState(initialState, key) {
  const [value, setValue] = useState(initialState);

  useEffect(() => {
    const storedValue = JSON.parse(localStorage.getItem(key));
    setValue(storedValue ? storedValue : initialState);
  }, [key, initialState]);

  useEffect(() => {
    if (!value) return;
    const valueToStore = value ? JSON.stringify(value) : null;
    localStorage.setItem(key, valueToStore);
  }, [value, key]);

  return [value, setValue];
}
