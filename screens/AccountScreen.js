import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { AuthContext } from '../store/auth-context';
import { useContext, useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SuggestProductScreen from './SuggestProductScreen';
import ContactScreen from './ContactScreen';
import MySubscriptionScreen from './MySubscriptionScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors } from '../constants/styles';
import axios from 'axios';
import { useNavigation, StackActions } from '@react-navigation/native';
import UserDetailScreen from './UserDetailScreen';
import PaymentScreen from './PaymentScreen';
import PastOrdersScreen from './PastOrdersScreen';

const accountOptions = [
  // {
  //   key: "1",
  //   text: "Profile",
  //   icon: "account"
  // },
  // {
  //   key: "2",
  //   text: "Manage Address",
  //   icon: "map-marker"
  // },
  {
    key: '3',
    text: 'My Subscriptions',
    icon: 'calendar-month',
  },
  {
	  key: "4",
	  text: "Past Orders",
    icon: "cart"
  },
  // {
	//   key: "5",
	//   text: "Manage Notifications",
  //   icon: "bell"
  // },
  {
	  key: "6",
	  text: "My Payments",
    icon: "currency-usd"

  },
  {
    key: '7',
    text: 'Suggest a product',
    icon: 'lightbulb-on-outline',
  },
  {
    key: '8',
    text: 'Help / Contact Us',
    icon: 'help-circle-outline',
  },
];

const myItemSeparator = () => {
  return (
    <View style={{ height: 2, backgroundColor: 'grey', marginHorizontal: 0 }} />
  );
};

const Stack = createNativeStackNavigator();

function AccountScreen({ navigation }) {
  const authCtx = useContext(AuthContext);
  const name = authCtx.name;
  const navigation1 = useNavigation();
  const [userDetails, setUserDetails] = useState([
    {
      id: '',
      firstname: 'Hello',
      lastname: 'User',
      phone_number: '',
      email_address: '',
      address: '',
    },
  ]);

  useEffect(() => {
    // Fetch user details from the API
    const fetchUserDetails = async () => {
      try {
        const getUserReq = {
          user_id: authCtx.localId,
        };
        const response = await axios.post(
          'http://dev-lb-subscribite-234585004.us-west-2.elb.amazonaws.com/users',
          getUserReq,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        console.log('user data:', response.data);
        setUserDetails(response.data);
        console.log('user name:', userDetails[0].firstname);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };


    fetchUserDetails();
  }, []);

  const handleItemPress = (item) => {
    // Navigate to the desired screen based on the item's key or text
    if (item.key === '7') {
      navigation.navigate('Suggest a Product');
    } else if (item.key === '3') {
      navigation.navigate('My Subscriptions');
    } else if (item.key === '8') {
      navigation.navigate('Help / Contact Us');
    }
    else if (item.key === "6") {
      navigation.navigate('My Payments', { userDetails: userDetails });
    }
    else if (item.key === "4") {
      navigation.navigate('Past Orders');
    }
    // Add more conditions for other screens
  };

  function handleEditProfile() {
    //navigation1.navigate('Edit Profile');
    navigation.navigate('Edit Profile', { userDetails: userDetails });
  }

 

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.profileImageContainer}>
          <Image
            source={require('../assets/icon.png')}
            style={styles.profileImage}
          />
        </View>
        <View style={styles.profileDetails}>
          <View style={styles.profileHeader}>
            <Text style={styles.profileNameText}>
              {userDetails[0].firstname + ' ' + userDetails[0].lastname}
            </Text>
            <View style={styles.editButtonContainer}>
              <TouchableOpacity onPress={handleEditProfile}>
                <MaterialCommunityIcons name='pencil' size={24} color='black' />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.profileText}>{userDetails[0].phone_number}</Text>
          <Text style={styles.profileText}>{userDetails[0].email_address}</Text>
        </View>
      </View>

      <View style={styles.deliveryAddressContainer}>
        <Text style={styles.sectionHeading}>Delivery Address</Text>
        <Text style={styles.addressText}>{userDetails[0].address}</Text>
      </View>

      <View style={styles.listContainer}>
        <FlatList
          data={accountOptions}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleItemPress(item)}>
              <View style={styles.listOptions}>
                <MaterialCommunityIcons
                  name={item.icon}
                  size={32}
                  color='black'
                />
                <Text style={styles.listText}>{item.text}</Text>
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={myItemSeparator}
          alwaysBounceVertical={false}
        />
      </View>
    </View>
  );
}


function AccountStack({ navigation }) {
        useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      navigation.dispatch(StackActions.replace('Account1'));
    });

    return unsubscribe;
  }, [navigation]);
        
  const authCtx = useContext(AuthContext);

  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name='Account1'
        component={AccountScreen}
      />
      <Stack.Screen
        //options={{ headerShown: false }}
        name='Suggest a Product'
        component={SuggestProductScreen}
      />
      <Stack.Screen
        //options={{ headerShown: false }}
        name='My Subscriptions'
        component={MySubscriptionScreen}
        initialParams={{
          api: 'http://dev-lb-subscribite-234585004.us-west-2.elb.amazonaws.com',
          userId: authCtx.localId, //TODO: make userid dynamic
        }}
      />
      <Stack.Screen 
      //options={{ headerShown: false }}
      name="Help / Contact Us" component={ContactScreen} />
       <Stack.Screen 
      //options={{ headerShown: false }}
      name="Edit Profile" component={UserDetailScreen} />
      <Stack.Screen 
      //options={{ headerShown: false }}
      name="My Payments" component={PaymentScreen} />
       <Stack.Screen 
      //options={{ headerShown: false }}
      name="Past Orders" component={PastOrdersScreen} />

      {/* Add more screens to the account stack */}
    </Stack.Navigator>
  );
}

export default AccountStack;

//export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.primary100,
  },
  listContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    backgroundColor: 'white',
  },
  listOptions: {
    fontSize: 18,
    marginTop: 6,
    fontWeight: 'bold',
    paddingVertical: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    //marginBottom: 20,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    backgroundColor: 'white',
    width: '100%',
    padding: 15,
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'black',
    marginRight: 15,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    resizeMode: 'cover',
  },
  profileDetails: {
    flex: 1,
    alignItems: 'flex-start',
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileText: {
    fontSize: 15,
    marginBottom: 1,
  },
  profileNameText: {
    fontSize: 18,

    fontWeight: 'bold',
    marginBottom: 1,
  },
  deliveryAddressContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    backgroundColor: 'white',
    paddingTop: 5,
    padding: 10,
    marginBottom: 15,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  addressText: {
    fontSize: 15,
    marginBottom: 3,
  },
  editButtonContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  listText: {
    marginLeft: 15,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
