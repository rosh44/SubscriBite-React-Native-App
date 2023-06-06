import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { AuthContext } from '../store/auth-context';
import { useContext } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SuggestProductScreen from './SuggestProductScreen';
import MySubscriptionScreen from './MySubscriptionScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const accountOptions = [
  {
    key: "1",
    text: "Profile",
    icon: "account"
  },
  {
    key: "2",
	  text: "Manage Address",
    icon: "map-marker"
  },
  {
	  key: "3",
	  text: "My Subscriptions",
    icon: "calendar-month"
  },
  {
	  key: "4",
	  text: "Orders",
    icon: "cart"
  },
  {
	  key: "5",
	  text: "Manage Notifications",
    icon: "bell"
  },
  {
	  key: "6",
	  text: "Payments",
    icon: "currency-usd"
  },
  {
	  key: "7",
	  text: "Suggest a product",
    icon: "lightbulb-on-outline"
  },
  {
	  key: "8",
	  text: "Help / FAQ",
    icon: "help-circle-outline"
  }
];

const myItemSeparator = () => {
  return <View style={{ height: 2, backgroundColor: "grey", marginHorizontal:0}} />;
  };

const Stack = createNativeStackNavigator();

function AccountScreen({navigation}) {
   
   const authCtx = useContext(AuthContext);
   const name = authCtx.name;

   const handleItemPress = (item) => {
    // Navigate to the desired screen based on the item's key or text
    if (item.key === "7") {
      navigation.navigate('SuggestProduct');
    } 
    else if (item.key === "3") {
      navigation.navigate('MySubsciptions');
    }
    // Add more conditions for other screens
  };

  return (
    <View>
      <FlatList 
        data = {accountOptions}
        renderItem = {({ item }) => (
          <TouchableOpacity onPress={() => handleItemPress(item)}>
            <View>
              <Text style={styles.listOptions}> 
              <MaterialCommunityIcons name={item.icon} size={32} color="black"/>
              {"   "}
              {item.text} </Text>
            </View>
            </TouchableOpacity>
          )}
        ItemSeparatorComponent={myItemSeparator}
        alwaysBounceVertical = {false}
      />
    </View>
  
  );
}

function AccountStack({navigation}) {
  return (
    <Stack.Navigator>
      <Stack.Screen 
     options={{ headerShown: false }}
      name="Account1" component={AccountScreen} 
      />
      <Stack.Screen 
      options={{ headerShown: false }}
      name="SuggestProduct" component={SuggestProductScreen} />
      <Stack.Screen 
      options={{ headerShown: false }}
      name="MySubsciptions" component={MySubscriptionScreen} 
      initialParams={{
        api: 'http://dev-lb-subscribite-234585004.us-west-2.elb.amazonaws.com',
        userId: 163, //TODO: make userid dynamic
      }}/>
      {/* Add more screens to the account stack */}
    </Stack.Navigator>
  );
}

export default AccountStack;

//export default AccountScreen;

const styles = StyleSheet.create({
  
  listOptions: {
    fontSize: 18,
    marginTop: 6,
    fontWeight: "bold",
    padding: 20
  }
});
