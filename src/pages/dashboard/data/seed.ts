import fs from 'fs';
import path from 'path';
import { faker } from '@faker-js/faker';

import { callStatuses } from './data';

const calls = Array.from({ length: 100 }, () => {
  const date = new Date().toLocaleTimeString();
  const time = new Date().toLocaleTimeString('en-in', {
    hour: 'numeric',
    minute: 'numeric',
  });

  return {
    id: `CALL-${faker.number.int({ min: 1000, max: 9999 })}`,
    name: faker.person.firstName(),
    phoneNumber: faker.phone.number({ style: 'national' }),
    duration: `${time}`,
    type: faker.helpers.arrayElement(callStatuses).value,
    date: `${date} ${time}`,
    remarks: faker.hacker
      .phrase()
      .replace(/^./, (letter) => letter.toUpperCase()),
  };
});

fs.writeFileSync(
  path.join(__dirname, 'calls.json'),
  JSON.stringify(calls, null, 2)
);

console.log('✅ Mock call data generated.');

export default calls;
