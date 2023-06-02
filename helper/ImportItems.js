import axios from 'axios';
import dummyItemsList from './dummyItemsList';
import { useState } from 'react';
export let itemsList = dummyItemsList;
const ImportItems = async () => {
  let items = [];
  console.log('Importing items...');
  const url =
    'http://dev-lb-subscribite-234585004.us-west-2.elb.amazonaws.com/products';
  const request_data = {
    postal_code: 92602,
  };

  try {
    const response = await axios.post(url, request_data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    // console.log('Response received');
    items = response.data.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.unit,
      img_url: item.img_url,
      attributes: [item.category.toString().toLowerCase()],
    }));
    // console.log(items);
  } catch (error) {
    console.log(error);
  }
  itemsList = items;
  return itemsList;
};

export default ImportItems;
