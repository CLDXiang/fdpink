import { verifyPassword, saltHashPassword } from './salt';

test('salted password should check', () => {
  const password = 'fareware my love';
  const salted = saltHashPassword(password);
  expect(salted.length).toBe(16 + 1 + 128); // salt + '|' + hex_sha512
  expect(verifyPassword(password, salted)).toBe(true);
  expect(verifyPassword('so sad', salted)).toBe(false);
  expect(salted.split('|').length).toBe(2);
  expect(verifyPassword(password, '2333')).toBe(false);
});
