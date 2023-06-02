import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useState } from 'react';

export const AuthContext = createContext({
  token: '',
  localId: '',
  isAuthenticated: false,
  name: '',
  isRegistered: false,
  //and we can have methods to change these values
  authenticate: () => {},
  setUserDetails: () => {},
  logout: () => {},
});

function AuthContextProvider({ children }) {
  const [authToken, setAuthToken] = useState();
  const [localId, setLocalId] = useState();
  const [name, setName] = useState();
  const [isRegistered, setIsRegistered] = useState(false);

  function authenticate({ token, localId }) {
    // console.log(`Token being set while authenticate: ${token}, ${localId}`);
    setAuthToken(token);
    setLocalId(localId);
    AsyncStorage.setItem('token', token); // key-> value, ensure both in string format
    AsyncStorage.setItem('localId', localId); // key-> value, ensure both in string format
  }

  function setUserDetails(name) {
    // console.log(`Name set as: ${name}`);
    setName(name);
  }
  function setRegisteredUser(registered) {
    console.log(`User registration status: ${registered}`);
    setIsRegistered(registered);
    AsyncStorage.setItem('registered', 'True');
  }
  function logout() {
    console.log('Logging user out...');
    setAuthToken(null);
    setLocalId(null);
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('localId');
  }

  //this object's keys should match what was created using useContext, because that thing^M
  // that was created will take this object as its "value"
  const value = {
    token: authToken,
    localId: localId,
    name: name,
    isAuthenticated: !!authToken, //basically true if string is not null
    isRegistered: isRegistered,
    setUserDetails: setUserDetails,
    authenticate: authenticate,
    setRegisteredUser: setRegisteredUser,
    logout: logout, //store: function_defined_here
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
