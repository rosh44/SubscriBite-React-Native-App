import AuthContent from '../components/Auth/AuthContent';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { createUser } from '../util/auth';
import { useState, useContext } from 'react';
import { Alert } from 'react-native';
import { AuthContext } from '../store/auth-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

function SignupScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContext);

  async function signUpHandler({ email, password }) {
    //to show some spinner while authentication is on
    setIsAuthenticating(true);
    try {
      let { token, localId } = await createUser(email, password); //returns a promise
      console.log(token);
      console.log('Sign up done with new ID');
      console.log(typeof email, email);
      console.log(typeof localId, localId);
      const numericString = localId.replace(/\D/g, '');
      const numericId =
        numericString !== '' ? parseInt(numericString, 10) : 100;
      console.log(`Numeric ID: ${numericId}`);
      localId = numericId;

      // need to send this to backend
      try {
        const registeratBackend = await axios.post(
          'http://dev-lb-subscribite-234585004.us-west-2.elb.amazonaws.com/register',
          {
            email_address: email,
            user_id: localId,
          }
        );

        console.log(
          `Backend registration: ${JSON.stringify(registeratBackend)}`
        );
        authCtx.authenticate({ token, localId });
        console.log(
          `Local ID to string being set after Firebase details sent to DB: ${localId.toString()}`
        );
        try {
          await AsyncStorage.setItem('localId', localId.toString());
        } catch (error) {}
      } catch (error) {
        console.log('Backend registration failed');
        console.log(error);
      }
      // const testRegistered = await AsyncStorage.getItem('registered');
      // console.log(testRegistered);
      authCtx.authenticate({ token, localId });
    } catch (error) {
      console.log(error);
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
