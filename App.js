import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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

//SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();

const BottomTabNavigation = () => {
  const authCtx = useContext(AuthContext);
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
            onPress={authCtx.logout}
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
        name='Subscriptions'
        component={CalendarScreen}
        initialParams={{
          api: 'http://dev-lb-subscribite-234585004.us-west-2.elb.amazonaws.com',
          userId: 163,
        }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='calendar' color={color} size={size} />
          ),
        }}
      />
      <BottomTab.Screen
        name='Account'
        component={AccountScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name='account' color={color} size={size} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
};

const HomeScreenStack = () => {
  return (
    <Stack.Navigator
      initialRouteName='HomeScreen'
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name='BottomTabNavigation'
        component={BottomTabNavigation}
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
  const authCtx = useContext(AuthContext);
  useEffect(() => {
    // console.log('Am in use Effect');

    async function fetchRegistered() {
      const isRegistered = await AsyncStorage.getItem('registered');
      //isRegistered = false;
      if (isRegistered) {
        // that means token is on device, hence user is already logged in
        // so set the auth context
        // console.log(`Token is stored as ${storedToken}`);
        // console.log(`ID is stored as ${localId}`);

        authCtx.setRegisteredUser(true);
      }
    }

    fetchRegistered();
  }, []);

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
          component={HomeScreenStack}
        />
      )}
      {/* <Stack.Screen name='UserDetail' component={UserDetailScreen} />
      <Stack.Screen name='Welcome' component={WelcomeScreen} /> */}
    </Stack.Navigator>
  );
}

function Navigation() {
  // now we can use useContext() to tap into the context part
  const authCtx = useContext(AuthContext);

  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}

function Root() {
  console.log('Am in root');
  const [isTryingLogin, setIsTryingLogin] = useState(true); // at first we are always logging in
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    // console.log('Am in use Effect');

    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem('token');
      const localId = await AsyncStorage.getItem('localId');

      if (storedToken) {
        // that means token is on device, hence user is already logged in
        // so set the auth context
        // console.log(`Token is stored as ${storedToken}`);
        // console.log(`ID is stored as ${localId}`);

        authCtx.authenticate({ token: storedToken, localId });
        setIsTryingLogin(false); // whether logged in or not, we are done trying to check if login
      }
    }

    fetchToken();
  }, []);

  return <Navigation />;
}

export default function App() {
  // we move the authcontextprovider stuff into this container

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
