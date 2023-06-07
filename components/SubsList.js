import {
    FlatList,
    TouchableOpacity,
    Image,
    View,
    Text,
    StyleSheet,
  } from 'react-native';
  
  
  function SubsList({ handleItemPress, filteredItems }) {
    //define the Cart context
    // initialize state variables
    const TimeEnum = {
      1: 'MORNING',
      2: 'NOON',
      3: 'EVENING',
      4: 'NIGHT',
    };
  
    const renderItem = ({ item }) => {
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
            
              <Text style={styles.inputLabel}>
                {item.item_quantity} every {item.freq} days in the{' '}
                {TimeEnum[item.time_slot_id]} slot
              </Text>
          </View>
        </TouchableOpacity>
      );
    };
  
    return (
      <FlatList 
        data={filteredItems}
        keyExtractor={(item) => item.subs_id.toString()}
        renderItem={renderItem}
      ></FlatList>
    );
  }
  
  export default SubsList;
  
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
    },
  });
  