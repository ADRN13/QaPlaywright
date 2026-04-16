import { expect } from "@playwright/test";


export const validLogin = { username: 'demouser', password: 'fashion123'}

export const invalidLoginTestCases = [
  { name: 'invalid username and password',          username: 'wrong',             password: 'wrong' },
  { name: 'invalid password for valid user',        username: validLogin.username, password: 'wrong' },
  { name: 'password with trailing space',           username: validLogin.username, password: `${validLogin.password} ` },
  { name: 'password with leading space',            username: validLogin.username, password: ` ${validLogin.password}` },
  { name: 'password with dot character',            username: validLogin.username, password: `${validLogin.password}.` },
  { name: 'password with exclamation mark',         username: validLogin.username, password: `${validLogin.password}!` },
  { name: 'invalid username for valid password',    username: 'wrong',             password: validLogin.password },
  { name: 'username with trailing space',           username: `${validLogin.username} `, password: validLogin.password },
  { name: 'username with leading space',            username: ` ${validLogin.username}`, password: validLogin.password },
  { name: 'username with special chars .',          username: `${validLogin.username}.`, password: validLogin.password },
  { name: 'username with special chars !',          username: `${validLogin.username}!`,  password: validLogin.password },
  { name: 'only special characters in credentials', username: '!@#$', password: '!@#$' },
  { name: 'username used as password',              username: validLogin.username, password: validLogin.username },
  { name: 'password used as username',              username: validLogin.password, password: validLogin.password }
];

export const restLoginData = [
  { name: 'valid login returns 200',  username: validLogin.username, password: validLogin.password, expectedStatus: 200 },
  { name: 'invalid password returns 401', username: validLogin.username, password: 'wrong', expectedStatus: 401 },
  { name: 'invalid username returns 401', username: 'wrong', password: validLogin.password, expectedStatus: 401 },
];

export const manyIncorrectLoginData = [
  { name: 'user can login after 10 failed attempts', validUsername: validLogin.username, validPassword: validLogin.password, invalidUsername: 'wrong', invalidPassword: 'wrong',numberOfRepetitions: 10 }]