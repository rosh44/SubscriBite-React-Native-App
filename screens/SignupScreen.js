import AuthContent from '../components/Auth/AuthContent';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { createUser } from '../util/auth';
import { useState, useContext } from 'react';
import { Alert } from 'react-native';
import { AuthContext } from '../store/auth-context';

function SignupScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContext);

  async function signUpHandler({ email, password }) {
    //to show some spinner while authentication is on
    setIsAuthenticating(true);
    try {
      const { token, localId } = await createUser(email, password); //returns a promise
      console.log(token);
      authCtx.authenticate({ token, localId });
    } catch (error) {
      Alert.alert('SignUp Failed', 'Something went wrong');
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message='Registering User...' />;
  }
  return <AuthContent onAuthenticate={signUpHandler} />;
}

export default SignupScreen;
