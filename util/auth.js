import axios from 'axios';
const FIREBASE_URL = 'https://identitytoolkit.googleapis.com/v1/accounts';

const API_KEY = 'AIzaSyBYHNhJXbrM57OfkH888CUUH3vf0Tlf7jM';

// export async function createUser(email, password) {
//   const response = await axios.post(BACKEND_URL + API_KEY, {
//     email: email,
//     password: password,
//     returnSecureToken: true,
//   });
// }

async function authenticate(mode, email, password) {
  const url = `${FIREBASE_URL}:${mode}?key=${API_KEY}`;
  const response = await axios.post(url, {
    email: email,
    password: password,
    returnSecureToken: true,
  });
  console.log(JSON.stringify(response.data, 0, 2));

  const token = response.data.idToken;
  const localId = response.data.localId;
  console.log(`Returned localId as ${localId} for ${mode}`);
  return { token, localId };
}

export function createUser(email, password) {
  return authenticate('signUp', email, password);
}

export function login(email, password) {
  return authenticate('signInWithPassword', email, password);
}
