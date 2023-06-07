import {
  FlatList,
  TouchableOpacity,
  Image,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useContext } from 'react';

import { CartContext } from '../store/cart-context';

function ItemList({ handleItemPress, filteredItems }) {
  //define the Cart context
  const cartCtx = useContext(CartContext);
  // initialize state variables
  const TimeEnum = {
    1: 'MORNING',
    2: 'NOON',
    3: 'EVENING',
    4: 'NIGHT',
  };

  const renderItem = ({ item }) => {
    // set a boolean to see if this item is already in subscriptions
    const sub = cartCtx.subscriptions.find(
      (subscription) => subscription.item_id === item.id
    );

    // if sub is null, it means the item has not yet been subscribed to.
    const isInCart = !!sub;
    return (
      <TouchableOpacity
        onPress={() => handleItemPress(item)}
        style={styles.itemCard}
      >
        <Image
          source={{
            uri: item.img_url,
          }}
          // source={item.image}
          style={styles.itemImage}
        />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>{`$${item.price.toFixed(2)}`}</Text>
          <Text style={styles.itemQuantity}>{item.quantity}</Text>
          {isInCart ? (
            // <Text style={styles.inputLabel}>
            //   {sub.quantity} every {sub.frequency} days in the{' '}
            //   {TimeEnum[sub.timeslot]} slot
            // </Text>
            <Text>You have subscribed to this item!</Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList 
      data={filteredItems}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
    ></FlatList>
  );
}

export default ItemList;

const styles = StyleSheet.create({
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  itemImage: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 14,
    marginBottom: 3,
  },
  itemQuantity: {
    fontSize: 12,
    color: 'gray',
  }
});
