import { View, Alert, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '../store/auth-context';
import { CartContext } from '../store/cart-context';
import { useState, useContext, useEffect } from 'react';
import axios from 'axios';

import SubsList from '../components/SubsList';
import AddSubsModal from '../components/AddSubsModal';
import * as SplashScreen from 'expo-splash-screen';
import ImportSubscriptions from '../helper/ImportSubscriptions';

function MySubscriptionScreen() {
  const [fetchItems, setFetchItems] = useState(true);
  useEffect(() => {
    // console.log('In home screen use efect');
    async function getItemsFromBackend() {
      const itemlist = await ImportSubscriptions(authCtx.localId);
      // console.log(`=======> ${itemlist[0]}`);
      setFilteredItems(itemlist);
    }
    getItemsFromBackend();
  }, []);

  const authCtx = useContext(AuthContext);
  const cartCtx = useContext(CartContext);

  const currentDate = new Date();
  const tomorrowDate = new Date(currentDate);
  const endDate = new Date(currentDate);
  tomorrowDate.setDate(currentDate.getDate() + 1);
  endDate.setDate(currentDate.getDate() + 365);

  const [searchText, setSearchText] = useState(''); // outside
  const [filteredItems, setFilteredItems] = useState([]); // list
  const [modalVisible, setModalVisible] = useState(false); // modal
  const [selectedItem, setSelectedItem] = useState(null); // modal

  const [fromDate, setFromDate] = useState(
    tomorrowDate.toISOString().slice(0, 10)
  ); // modal
  const [toDate, setToDate] = useState(endDate.toISOString().slice(0, 10)); // modal
  const [quantity, setQuantity] = useState(1); // modal
  const [frequency, setFrequency] = useState('1'); // modal
  const [timeslot, setTimeslot] = useState(1); // modal
  const [selectedFilter, setSelectedFilter] = useState(''); // for outside

  const handleItemPress = (item) => {
    setSelectedItem(item);
    setQuantity(item.item_quantity);
    setFrequency('' + item.freq);
    setTimeslot(item.time_slot_id);
    setFromDate(item.sub_start_date);
    setToDate(item.sub_end_date);
    setModalVisible(true);
  }; // list

  const incrementQuantity = () => {
    if (quantity < 5) {
      setQuantity(quantity + 1);
    }
  }; // modal

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  }; // modal
  const closeModal = () => {
    setSelectedItem(null);
    setModalVisible(false);
    // setFrequency('1');
    // setTimeslot(1);
    // setQuantity(1);
  }; // modal

  async function handleConfirm() {
    const upd_subscription_request = {
      user_id: authCtx.localId,
      sub_id: selectedItem.subs_id,
      item_id: selectedItem.id,
      sub_start_date: new Date(fromDate).toISOString().slice(0, 10),
      sub_end_date: new Date(toDate).toISOString().slice(0, 10),
      freq: parseInt(frequency),
      quantity: quantity,
      slot: timeslot,
    };
    // console.log('update subs req:', upd_subscription_request);
    try {
      const response = await axios.put(
        'http://dev-lb-subscribite-234585004.us-west-2.elb.amazonaws.com/subscriptions/subscribe',
        upd_subscription_request,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('update subs res:', response.data);
      const itemlist = await ImportSubscriptions(authCtx.localId);
      setFilteredItems(itemlist);
      cartCtx.changeRefreshItem(); // to ensure calendar screen calls api again
      Alert.alert('Success', 'Subscription updated!');
      closeModal();
    } catch (error) {
      console.log(error);
    } finally {
      // console.log('Finally');
    }
  } // modal

  async function handleUnSubscribe() {
    // console.log('sub_id', selectedItem.subs_id);
    const unsubscribe_request = {
      sub_id: '' + selectedItem.subs_id,
    };
    try {
      const response = await axios.delete(
        'http://dev-lb-subscribite-234585004.us-west-2.elb.amazonaws.com/subscriptions',
        {
          data: unsubscribe_request,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('DELETED', response.data);
      const itemlist = await ImportSubscriptions(authCtx.localId);
      setFilteredItems(itemlist);
      cartCtx.changeRefreshItem(); // to ensure calendar screen calls api again
      // remove from store to ensure home screen does not display item (if there are more subscriptions, it should not remove them though)

      cartCtx.removeSubscription(selectedItem.subs_id);
      Alert.alert('Success', 'Product unsubscribed!');
      closeModal();
    } catch (error) {
      console.log(error);
    } finally {
      // console.log('Finally');
    }
  } //modal

  const handleLayout = () => {
    // fetchItems ? null : setFilteredItems(itemsList);
    SplashScreen.hideAsync();
  };
  const name = authCtx.name;
  return (
    <View onLayout={handleLayout}>
      <View style={styles.container}>
        <Text style={styles.updateText}>
          {' '}
          Tap on the item to Update or Unsubscribe{' '}
        </Text>
      </View>
      <View style={styles.listContainer}>
        <SubsList
          handleItemPress={handleItemPress}
          filteredItems={filteredItems}
        />
      </View>
      <AddSubsModal
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
        handleUnSubscribe={handleUnSubscribe}
        tomorrowDate={tomorrowDate}
        endDate={endDate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  updateText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 100,
  },
});

export default MySubscriptionScreen;
