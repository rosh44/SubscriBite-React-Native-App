import axios from 'axios';
//import dummyItemsList from './dummyItemsList';
import { useState } from 'react';
export let itemsList = [];
const ImportSubscriptions = async () => {
  let items = [];
  console.log('Importing items...');
  const url =
    'http://dev-lb-subscribite-234585004.us-west-2.elb.amazonaws.com/subscriptions/getSubscriptions';
  const request_data = {
    user_id: 163,
  };

  try {
    const response = await axios.post(url, request_data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    // console.log('Response received');
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
      time_slot_id: item.time_slot_id
    }));
    // console.log(items);
  } catch (error) {
    console.log(error);
  }
  itemsList = items;
  return itemsList;
};

export default ImportSubscriptions;
