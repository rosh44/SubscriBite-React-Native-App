import AuthContent from '../components/Auth/AuthContent';
import { useState, useContext } from 'react';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { Alert } from 'react-native';
import { login } from '../util/auth';
import { AuthContext } from '../store/auth-context';

function LoginScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContext);

  async function loginHandler({ email, password }) {
    //to show some spinner while authentication is on
    setIsAuthenticating(true);
    try {
      let { token, localId } = await login(email, password); //returns a promise
      const numericString = localId.replace(/\D/g, '');
      const numericId =
        numericString !== '' ? parseInt(numericString, 10) : 100;
      console.log(`Numeric ID from loginHandler: ${numericId}`);
      localId = numericId;
      authCtx.authenticate({ token, localId });
    } catch (error) {
      console.log(error);
      Alert.alert('Login Failed', 'Check details and try again');
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message='Logging in...' />;
  }
  return <AuthContent isLogin onAuthenticate={loginHandler} />;
}

export default LoginScreen;
