import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '../store/auth-context';
import { CartContext } from '../store/cart-context';
import { useState, useContext, useEffect } from 'react';
import axios from 'axios';

import SearchBar from '../components/SearchBar';
import ItemList from '../components/ItemList';
import AddItemModal from '../components/AddItemModal';
import FilterBar from '../components/FilterBar';
import * as SplashScreen from 'expo-splash-screen';
import ImportItems from '../helper/ImportItems';
import { itemsList } from '../helper/ImportItems';

function HomeScreen() {
  const [fetchItems, setFetchItems] = useState(true);
  useEffect(() => {
    // console.log('In home screen use efect');
    async function getItemsFromBackend() {
      const itemlist = await ImportItems();
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

  const filterItemsFromCategory = (text) => {
    const filtered = itemsList.filter(
      (item) =>
        item.name.toLocaleLowerCase().includes(text.toLocaleLowerCase()) ||
        item.attributes.some((attribute) =>
          attribute.toLocaleLowerCase().includes(text.toLocaleLowerCase())
        )
    );
    setFilteredItems([...filtered]);
  }; // list

  const handleCategoryPress = (category) => {
    // if the category is already selected, remove it from the selection
    if (category === selectedFilter) {
      setSelectedFilter('');
      filterItemsFromCategory('');
    } else {
      setSelectedFilter(category);
      filterItemsFromCategory(category);
      setSearchText('');
    }
  }; // list
  const filterItems = (text) => {
    const filtered = itemsList.filter(
      (item) =>
        item.name.toLocaleLowerCase().includes(text.toLocaleLowerCase()) ||
        item.attributes.some((attribute) =>
          attribute.toLocaleLowerCase().includes(text.toLocaleLowerCase())
        )
    );
    setFilteredItems([...filtered]);
  }; // list

  const handleSearchTextChange = (text) => {
    setSearchText(text);
    filterItems(text);
  }; // list

  const handleItemPress = (item) => {
    setSelectedItem(item);
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
    setFrequency('1');
    setTimeslot(1);
    setQuantity(1);
  }; // modal

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
    // console.log(` ${fromDate} -- ${toDate}`);

    console.log('Sending request to backend:',add_subscription_request);
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
      // console.log(`Current Subscriptions: ${cartCtx.subscriptions}`);

      const store_subscription = {
        user_id: 163,
        item_id: selectedItem.id,
        frequency: parseInt(frequency),
        quantity: quantity,
        timeslot: timeslot,
      };
      // console.log(`Subscription to be stored: ${store_subscription}`);

      cartCtx.addSubscription(store_subscription);
      cartCtx.changeRefreshItem();
      // console.log(`Current Subscriptions: ${cartCtx.subscriptions}`);

      // console.log(`Status: ${response.status}`);
      // now I will add it to react-store
    } catch (error) {
      console.log(error);
    } finally {
      console.log('Finally');
    }
    // Update the value within the items screen
    // updateValue(item.id, quantity);
    setSelectedItem(null);
    setModalVisible(false);
    setFrequency('1');
    setTimeslot(1);
    setQuantity(1);
  } // modal
  const handleLayout = () => {
    // fetchItems ? null : setFilteredItems(itemsList);
    SplashScreen.hideAsync();
  };
  const name = authCtx.name;
  return (
    <View onLayout={handleLayout}>
      <SearchBar
        searchText={searchText}
        handleSearchTextChange={handleSearchTextChange}
      />

      <FilterBar
        handleCategoryPress={handleCategoryPress}
        selectedFilter={selectedFilter}
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
        tomorrowDate={tomorrowDate}
        endDate={endDate}
      />
    </View>
  );
}

export default HomeScreen;
