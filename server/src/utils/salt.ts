import * as crypto from 'crypto';

// see https://ciphertrick.com/salt-hash-passwords-using-nodejs-crypto/

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
const genRandomString = (length: number) => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex') /** convert to hexadecimal format */
    .slice(0, length); /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
const sha512 = (password: string, salt: string) => {
  const hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
  hash.update(password);
  const value = hash.digest('hex');
  return salt + '|' + value;
};

/**
 * Salt-hash password, return salted result of length 145
 * consists the salt and the hash value.
 * @param {string} password - Password to be salted
 */
export function saltHashPassword(password: string): string {
  const salt = genRandomString(16); /** Gives us salt of length 16 */
  const salted = sha512(password, salt);
  return salted;
}

/**
 * Verify the password with the salted password.
 * @param password - Password to be checke.
 * @param salted - Salted password created by saltHashPassword.
 */
export function verifyPassword(password: string, salted: string): boolean {
  const salt = salted.split('|')[0];
  const calced = sha512(password, salt);
  return calced === salted;
}
