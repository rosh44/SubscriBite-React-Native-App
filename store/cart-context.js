import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useState, useEffect } from 'react';

// this is simply a context created using the useContext hook that can be later accessed by everyone else
// the CartContext.Provider actually gives access to this Context later

export const CartContext = createContext({
  userId: '',
  subscriptions: [],
  addSubscription: () => {},
  setSubscriptionsInitially: () => {},
  refreshItem: 0,
  changeRefreshItem: () => {},
});

// this function returns a CartContext.Provider with the essential value props
// it takes in children props as argument simply to forward along to the provider that it returns, ie
// return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
//
function CartContextProvider({ children }) {
  const [userId, setUserId] = useState();
  const [subscriptions, setSubscriptions] = useState([]);
  const [refreshItem, setRefreshItem] = useState(0);
  useEffect(() => {
    // console.log(`Updated subscriptions: ${JSON.stringify(subscriptions)}`);
  }, [subscriptions]);

  function changeRefreshItem() {
    setRefreshItem(refreshItem + 1);
    // console.log(`Inside store: ${refreshItem}`);
  }
  function addSubscription(subscription) {
    const myObject = JSON.stringify(subscription);
    console.log(`Received subscription: ${myObject}`);
    setSubscriptions([...subscriptions, subscription]);
    // console.log(`Set subscription: ${subscriptions}`);
  }
  function setSubscriptionsInitially(subscriptions_list) {
    // this function will set the initial list of subscriptions
    setSubscriptions([...subscriptions_list]);
  }
  // now create a value object that associates the created values with the context object
  const value = {
    userId: userId,
    subscriptions: subscriptions,
    addSubscription: addSubscription,
    setSubscriptionsInitially: setSubscriptionsInitially,
    refreshItem: refreshItem,
    changeRefreshItem: changeRefreshItem,
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export default CartContextProvider;
