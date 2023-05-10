import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useContext } from 'react';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import UserDetailScreen from './screens/UserDetailScreen';
import CalendarScreen from './screens/CalendarScreen';
import AccountScreen from './screens/AccountScreen';
import { Colors } from './constants/styles';
import AuthContextProvider, { AuthContext } from './store/auth-context';
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();

const BottomTabNavigation = () => {
  return(
        <BottomTab.Navigator
        screenOptions={{
          headerStyle: {backgroundColor: Colors.primary500 },
          headerTintColor: 'white',
          tabBarStyle: { backgroundColor: Colors.primary500},
          tabBarInactiveTintColor: 'white'
        }}>
        <BottomTab.Screen
          name= "Home"
          component= {HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" color={color} size={size} />
            )
          }}/> 
        <BottomTab.Screen
          name= "Subscriptions"
          component= {CalendarScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar" color={color} size={size} />
            )
          }}
        />
        <BottomTab.Screen
          name= "Account"
          component= {AccountScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons name="account" color={color} size={size} />
            )
          }}
        />
      </BottomTab.Navigator>
  );
}

const HomeScreenStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="BottomTabNavigation" component={BottomTabNavigation} />
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

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      {!authCtx.isRegistered ? (
        <Stack.Screen name='UserDetail' component={UserDetailScreen} />
      ) : (
        <Stack.Screen options={{headerShown: false}} name='HomeScreenStack' component={HomeScreenStack} />
        
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

export default function App() {
  // we move the authcontextprovider stuff into this container
  return (
    <>
      <StatusBar style='light' />
      <AuthContextProvider>
        <Navigation />
      </AuthContextProvider>
    </>
  );
}
