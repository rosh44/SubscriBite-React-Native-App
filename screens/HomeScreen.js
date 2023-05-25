import { View } from 'react-native';
import { AuthContext } from '../store/auth-context';
import { CartContext } from '../store/cart-context';
import { useState, useContext } from 'react';
import axios from 'axios';
import dummyItemsList from './dummyItemsList';

import SearchBar from '../components/SearchBar';
import ItemList from '../components/ItemList';
import AddItemModal from '../components/AddItemModal';

function HomeScreen() {
  const authCtx = useContext(AuthContext);
  const cartCtx = useContext(CartContext);

  const [searchText, setSearchText] = useState('');
  const [filteredItems, setFilteredItems] = useState(dummyItemsList);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [fromDate, setFromDate] = useState('2023-05-24');
  const [toDate, setToDate] = useState('2023-11-24');
  const [quantity, setQuantity] = useState(1);
  const [frequency, setFrequency] = useState('1');
  const [timeslot, setTimeslot] = useState(1);

  const filterItems = (text) => {
    const filtered = dummyItemsList.filter(
      (item) =>
        item.name.toLocaleLowerCase().includes(text.toLocaleLowerCase()) ||
        item.attributes.some((attribute) =>
          attribute.toLocaleLowerCase().includes(text.toLocaleLowerCase())
        )
    );
    setFilteredItems(filtered);
  };

  const handleSearchTextChange = (text) => {
    setSearchText(text);
    filterItems(text);
  };

  const handleItemPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const incrementQuantity = () => {
    if (quantity < 5) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  const closeModal = () => {
    setSelectedItem(null);
    setModalVisible(false);
    setFrequency('1');
    setTimeslot(1);
    setQuantity(1);
  };

  async function handleConfirm() {
    const add_subscription_request = {
      user_id: 163,
      item_id: selectedItem.id,
      sub_start_date: fromDate,
      sub_end_date: toDate,
      freq: parseInt(frequency),
      quantity: quantity,
      slot: timeslot,
    };
    console.log(add_subscription_request);
    try {
      const response = await axios.post(
        'http://dev-lb-subscribite-234585004.us-west-2.elb.amazonaws.com/subscriptions/subscribe',
        add_subscription_request,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(`Current Subscriptions: ${cartCtx.subscriptions}`);

      const store_subscription = {
        user_id: 163,
        item_id: selectedItem.id,
        frequency: parseInt(frequency),
        quantity: quantity,
        timeslot: timeslot,
      };
      console.log(`Subscription to be stored: ${store_subscription}`);

      cartCtx.addSubscription(store_subscription);
      console.log(`Current Subscriptions: ${cartCtx.subscriptions}`);

      // console.log(`Status: ${response.status}`);
      // now I will add it to react-store
    } catch (error) {
    } finally {
      console.log('Finally');
    }
    // Update the value within the items screen
    // updateValue(item.id, quantity);
    setSelectedItem(null);
    setModalVisible(false);
    setFrequency('1');
    setTimeslot();
    setQuantity(1);
  }
  const name = authCtx.name;
  return (
    <View>
      <SearchBar
        searchText={searchText}
        handleSearchTextChange={handleSearchTextChange}
      />
      <ItemList
        handleItemPress={handleItemPress}
        filteredItems={filteredItems}
      />
      <AddItemModal
        modalVisible={modalVisible}
        closeModal={closeModal}
        incrementQuantity={incrementQuantity}
        decrementQuantity={decrementQuantity}
        quantity={quantity}
        fromDate={fromDate}
        toDate={toDate}
        setFromDate={setFromDate}
        setToDate={setToDate}
        frequency={frequency}
        setFrequency={setFrequency}
        timeslot={timeslot}
        setTimeslot={setTimeslot}
        selectedItem={selectedItem}
        handleConfirm={handleConfirm}
      />
    </View>
  );
}

export default HomeScreen;

// const styles = StyleSheet.create({
//   rootContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 32,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
// });
