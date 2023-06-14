import axios from 'axios';
//import dummyItemsList from './dummyItemsList';
import { useState, useContext } from 'react';

export let itemsList = [];
const ImportSubscriptions = async (localId) => {
  let items = [];
  console.log('Importing items for ', localId);
  // const authCtx = useContext(AuthContext);
  const url =
    'http://dev-lb-subscribite-234585004.us-west-2.elb.amazonaws.com/subscriptions/getSubscriptions';
  const request_data = {
    user_id: localId,
  };

  try {
    const response = await axios.post(url, request_data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Get subscriptions response received');
    items = response.data.map((item) => ({
      subs_id: item.subscription_id,
      id: item.item_id,
      name: item.name,
      price: item.price,
      item_quantity: item.quantity,
      img_url: item.img_url,
      sub_start_date: item.sub_start_date,
      sub_end_date: item.sub_end_date,
      freq: item.freq,
      time_slot_id: item.time_slot_id,
    }));
    // console.log(items);
    // Sort the items by itemid and frequency
    items.sort((a, b) => {
      if (a.id < b.id) {
        return -1;
      } else if (a.id > b.id) {
        return 1;
      } else {
        // If itemid is the same, sort by frequency
        if (a.freq < b.freq) {
          return -1;
        } else if (a.freq > b.freq) {
          return 1;
        } else {
          return 0;
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
  itemsList = items;
  return itemsList;
};

export default ImportSubscriptions;
