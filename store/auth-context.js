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
    setAuthToken(token);
    setLocalId(localId);
  }

  function setUserDetails(name) {
    console.log(`Name set as: ${name}`);
    setName(name);
  }
  function setRegisteredUser(registered) {
    console.log(`User registration status: ${registered}`);

    setIsRegistered(registered);
  }
  function logout() {
    setAuthToken(null);
  }

  //now a value object that is supposed to tie the store values to these apparently
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
