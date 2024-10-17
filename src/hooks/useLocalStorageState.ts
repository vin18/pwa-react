import { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

export function useLocalStorageState(initialState, key, secretKey) {
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
