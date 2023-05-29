import { StyleSheet, Text, View, FlatList } from 'react-native';
import { AuthContext } from '../store/auth-context';
import { useContext } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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

function AccountScreen() {
   const authCtx = useContext(AuthContext);
   const name = authCtx.name;
  return (
    <View>
      <FlatList 
        data = {accountOptions}
        renderItem = {(itemData) =>{
          return (
            <View>
              <Text style={styles.listOptions}> 
              <MaterialCommunityIcons name={itemData.item.icon} size={32} color="black"/>
              {"   "}
              {itemData.item.text} </Text>
            </View>
          );
        }}
        ItemSeparatorComponent={myItemSeparator}
        alwaysBounceVertical = {false}
      />
    </View>
  
  );
}

export default AccountScreen;

const styles = StyleSheet.create({
  
  listOptions: {
    fontSize: 18,
    marginTop: 6,
    fontWeight: "bold",
    padding: 20
  }
});
