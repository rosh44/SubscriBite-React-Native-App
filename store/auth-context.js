import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useState } from 'react';

export const AuthContext = createContext({
  token: '',
  localId: 0,
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

  async function authenticate({ token, localId }) {
    console.log(`Token & LocalId being set while authenticate: ${localId}`);
    setAuthToken(token);
    setLocalId(localId); // set as number here
    // if this is coming from login authenticate in root, then these values are already set
    try {
      await AsyncStorage.setItem('token', token); // key-> value, ensure both in string format
      await AsyncStorage.setItem('localId', localId.toString()); // key-> value, ensure both in string format
      console.log(
        'Set token and localId in device storage as well as react store'
      );
    } catch {}
  }

  function setUserDetails(name) {
    // console.log(`Name set as: ${name}`);
    setName(name);
  }
  async function setRegisteredUser(registered) {
    console.log(`authCtx setRegisteredUser being called with: ${registered}`);
    // now authCtx.isRegistered should be true, and let us also store this on the device
    setIsRegistered(registered);
    try {
      await AsyncStorage.setItem('registered', 'true');
      console.log('Set registration status on device');
    } catch (e) {}
  }
  function logout() {
    console.log('Logging user out...');
    setAuthToken(null);
    setLocalId(null);
    setIsRegistered(false);
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('localId');
    AsyncStorage.removeItem('registered');
    console.log(
      'Set token, localId, and registered as false and removed them from Async Storage'
    );
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
