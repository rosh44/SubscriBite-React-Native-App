import { NavigationContainer, useNavigation } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  StackActions,
} from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext, useEffect, useState } from 'react';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import UserDetailScreen from './screens/UserDetailScreen';
import CalendarScreen from './screens/CalendarScreen';
import AccountScreen from './screens/AccountScreen';
import { Colors } from './constants/styles';
import AuthContextProvider, { AuthContext } from './store/auth-context';
import CartContextProvider, { CartContext } from './store/cart-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import IconButton from './components/ui/IconButton';
import * as SplashScreen from 'expo-splash-screen';
import axios from 'axios';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();

const RenderAccountScreenNavigation = ({ navigation }) => (
  <AccountScreen navigation={navigation} />
);

const BottomTabNavigation = ({ navigation }) => {
  const authCtx = useContext(AuthContext);
  //const navigation = useNavigation();

  const handleLogout = () => {
    authCtx.logout();
  };

  return (
    <BottomTab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: 'white',
        tabBarStyle: { backgroundColor: Colors.primary500 },
        tabBarInactiveTintColor: 'white',
        headerRight: ({ tintColor }) => (
          <IconButton
            icon='exit'
            color={tintColor}
            size={24}
            onPress={handleLogout}
          />
        ),
      }}
    >
      <BottomTab.Screen
        name='Home'
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='home' color={color} size={size} />
          ),
        }}
      />
      <BottomTab.Screen
        name='Calendar'
        component={CalendarScreen}
        initialParams={{
          api: 'http://dev-lb-subscribite-234585004.us-west-2.elb.amazonaws.com',
          userId: authCtx.localId,
        }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='calendar' color={color} size={size} />
          ),
        }}
      />
      <BottomTab.Screen
        name='Account'
        //component={AccountScreen}
        component={RenderAccountScreenNavigation}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name='account' color={color} size={size} />
          ), //,headerShown: false
        }}
      />
    </BottomTab.Navigator>
  );
};

const RenderBottomTabNavigation = ({ navigation }) => (
  <BottomTabNavigation navigation={navigation} />
);

const HomeScreenStack = () => {
  return (
    <Stack.Navigator
      initialRouteName='HomeScreen'
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name='BottomTabNavigation'
        //component={BottomTabNavigation}
        component={RenderBottomTabNavigation}
      />
    </Stack.Navigator>
  );
};

function AuthStack() {
  //this is the stuff that is displayed prior to the user being authenticated
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='Signup' component={SignupScreen} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  //this is the stuff that is displayed after the user is authenticated
  // we do not need to show login screens and all once this is done
  // you only render this Navigator if a certain condition is met (ie logged in user)

  // Now here what I want to do, is to call backend with this localId that I have and check if the user is registered or not.

  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();
  useEffect(() => {
    console.log(
      `Am in Authenicated Stack Use Effect: Before everything, isRegistered is: ${authCtx.isRegistered}`
    );
    console.log(`and authCtx.localId is: ${authCtx.localId}`);

    async function fetchRegistered() {
      console.log(
        'Now I am going to fetch the registration status from backend...'
      );
      let localId = authCtx.localId;
      // by default let us set an isRegistered to false
      let isRegistered = false;
      try {
        console.log(`Sending user id to register/: ${localId}`);
        let res = await axios.post(
          'http://dev-lb-subscribite-234585004.us-west-2.elb.amazonaws.com/isRegistered',
          {
            user_id: localId,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        console.log(
          `Backend registration check: User registration status is --> ${JSON.stringify(
            res.data
          )}`
        );
        isRegistered = res.data;
      } catch (error) {
        console.log('IsRegistered checking had an error');
        console.log(error);
      }
      if (isRegistered) {
        // we came to know that the user is Registered after backend call
        console.log(
          'Setting isRegistered as trues to make sure I can set registration status.'
        );
        authCtx.setRegisteredUser(true);
      }
      console.log('End of Authenticated Stack use Effect');
    }
    // authCtx.setRegisteredUser(true);

    try {
      authCtx.localId && fetchRegistered();
    } catch (e) {
      console.log('Effect error');
    }
  }, [authCtx.localId]);

  const RenderHomeScreenStack = () => (
    <HomeScreenStack navigation={navigation} />
  );

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      {!authCtx.isRegistered ? (
        <Stack.Screen
          name='Profile Details'
          component={UserDetailScreen}
          initialParams={{
            userDetails: [
              {
                id: '',
                firstname: '',
                lastname: '',
                phone_number: '',
                email_address: '',
                address: '',
              },
            ],
          }}
          // options={{
          //   headerRight: ({ tintColor }) => {
          //     <IconButton
          //       icon='exit'
          //       color={tintColor}
          //       size={24}
          //       onPress={authCtx.logout}
          //     />;
          //   },
          // }}
        />
      ) : (
        <Stack.Screen
          options={{ headerShown: false }}
          name='HomeScreenStack'
          //component={HomeScreenStack}
          component={RenderHomeScreenStack}
        />
      )}
      {/* <Stack.Screen name='UserDetail' component={UserDetailScreen} />
      <Stack.Screen name='Welcome' component={WelcomeScreen} /> */}
    </Stack.Navigator>
  );
}

function Navigation() {
  const authCtx = useContext(AuthContext);
  // now we can use useContext() to tap into the context part
  // this runs after Root (if user is logged in, then token is present on device, and now also in authCtx)
  console.log(`In Navigation, authenticated is: ${authCtx.isAuthenticated}`);
  // authCtx.isAuthenicated is the truthy or falsy based on if authCtx.token exists or not.
  // one of the 2 Navigations Stacks is shown according to this value.
  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}

function Root() {
  // console.log('Am in root');
  const [isTryingLogin, setIsTryingLogin] = useState(true); // at first we are always logging in
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    console.log('Am in root Effect');

    async function fetchToken() {
      try {
        const token = await AsyncStorage.getItem('token');
        let localId = await AsyncStorage.getItem('localId');
        console.log(token);
        localId = parseInt(localId, 10);
        console.log(localId);

        if (token) {
          // that means token is on device, hence user is already logged in
          // so set the auth context
          // console.log(`Token is stored as ${storedToken}`);
          // console.log(`ID is stored as ${localId}`);
          console.log(
            `In Root --> with token and localId as: ${(token, localId)}`
          );
          authCtx.authenticate({ token, localId });
          setIsTryingLogin(false); // whether logged in or not, we are done trying to check if login
        } else {
          console.log('Not logged in as token is not on device.');
        }
      } catch (e) {
        console.log(e);
      }
    }

    try {
      fetchToken();
    } catch (e) {}
  }, []);

  return <Navigation />;
}

export default function App() {
  return (
    <>
      <StatusBar style='light' />
      <AuthContextProvider>
        <CartContextProvider>
          <Root> </Root>
        </CartContextProvider>
      </AuthContextProvider>
    </>
  );
}
