import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Modal,
  Pressable,
} from 'react-native';
import { Image } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Feather';
import IncDecButton from '../ui/IncDecButton';
import LeftRight from '../ui/LeftRight';

const movement = [
  'Morning (6 AM - 8 AM)',
  'Noon (11 AM - 1 PM)',
  'Evening (4 PM - 6 PM)',
  'Night (9 PM - 11 PM)',
];
const movement_mapper = {
  'Morning (6 AM - 8 AM)': 1,
  'Noon (11 AM - 1 PM)': 2,
  'Evening (4 PM - 6 PM)': 3,
  'Night (9 PM - 11 PM)': 4,
};

const SubscriptionList = (props) => {
  let { dateData, parentFunction, api } = props;
  let [overallState, setOverallState] = useState(false);
  let [newDataPushed, setNewDataPushed] = useState(0);
  let [quantChange, setQuantChange] = useState(0);

  useEffect(() => {
    // Making two dictionaries org_data and change_data to capture the changes needed to make page more responsive.
    if (dateData) {
      org_data = dateData.reduce((acc, item) => {
        acc[item.id] = {
          time_slot_description: item.time_slot_description,
          quantity: item.quantity,
        };
        return acc;
      }, {});
      changed_data = JSON.parse(JSON.stringify(org_data));
      for (const key in changed_data) {
        changed_data[key]['change'] = (function (key) {
          if (
            org_data[key]['quantity'] != changed_data[key]['quantity'] ||
            org_data[key]['time_slot_description'] !=
              changed_data[key]['time_slot_description']
          ) {
            return true;
          }
          return false;
        })(key);
      }
    } else {
      org_data = {};
      changed_data = {};
    }
  }, [dateData]);

  function IncDecUpdate(id, quantity) {
    // Based on the changed field, do we need to show the Save Button? Or the user set it back to way it was before.
    if (changed_data[id]) {
      changed_data[id]['quantity'] = quantity;
      if (
        (org_data[id]['quantity'] === changed_data[id]['quantity']) &
        (org_data[id]['time_slot_description'].trim() ===
          changed_data[id]['time_slot_description'].trim())
      ) {
        changed_data[id]['change'] = false;
      } else {
        changed_data[id]['change'] = true;
      }
    }
    let f = false;
    for (key in changed_data) {
      f = f || changed_data[key]['change'];
    }
    setQuantChange(quantChange + 1);
    setOverallState(f);
  }

  function LeftRightUpdate(id, time_slot_description) {
    // Based on the changed field, do we need to show the Save Button? Or the user set it back to way it was before.
    if (changed_data[id]) {
      changed_data[id]['time_slot_description'] = time_slot_description;
      if (
        (org_data[id]['quantity'] === changed_data[id]['quantity']) &
        (org_data[id]['time_slot_description'].trim() ===
          changed_data[id]['time_slot_description'].trim())
      ) {
        changed_data[id]['change'] = false;
      } else {
        changed_data[id]['change'] = true;
      }
    }
    let f = false;
    for (key in changed_data) {
      f = f || changed_data[key]['change'];
    }
    setOverallState(f);
  }

  function saveDB(create_data) {
    const url = api + '/subscriptions/update_upcoming_orders';
    const data = create_data;
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch((error) => {
      console.error('Error:', error);
      return 0;
    });
    return 1;
  }

  function saveTheStateToDB() {
    if (overallState) {
      setNewDataPushed(newDataPushed + 1);
      create_data_to_push = { data: [] };
      for (let i in changed_data) {
        if (changed_data[i]['change']) {
          create_data_to_push['data'].push({
            id: i,
            quantity: changed_data[i]['quantity'],
            slot: movement_mapper[changed_data[i]['time_slot_description']],
          });
        }
      }
      if (saveDB(create_data_to_push)) {
        setOverallState(false);
        parentFunction();
      }
    }
  }

  const renderItem = ({ item }) => {
    return (
      <View
        style={[{ flex: 1, flexDirection: 'row' }, styles.itemsMainContainer]}
      >
        <View style={[{ flex: 2, flexDirection: 'column' }]}>
          <View styles={{ flex: 1, flexDirection: 'column' }}>
            <View styles={{ flex: 1 }}>
              <View style={styles.itemContainer}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>{item.name}</Text>
                    <Text style={styles.headerText}>${item.price}</Text>
                  </View>
                </View>
                <View style={styles.description}>
                  <Text>{item.description}</Text>
                  <IncDecButton
                    quantity={item.quantity}
                    uniqueId={item.id}
                    parentUpdateFunc={IncDecUpdate}
                    style={{ padding: 0 }}
                  />
                  <View>
                    <LeftRight
                      slotValue={item.time_slot_description}
                      movement={movement}
                      uniqueId={item.id}
                      parentUpdateFunc={LeftRightUpdate}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* </View> */}
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            backgroundColor: 'white',
            padding: 4,
          }}
        >
          <View style={{ flex: 6, backgroundColor: 'white' }}>
            <Image
              style={{ width: '100%', height: '100%', alignItems: 'center' }}
              source={{ uri: item.img_url }}
              resizeMode='cover'
            />
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: 'white',
              alignItems: 'center',
              justifyContent: 'flex-end',
              alignContent: 'center',
              fontWeight: 'bold',
            }}
          >
            <Text style={{ fontWeight: 'bold' }}>
              $
              {(
                (changed_data[item.id]
                  ? changed_data[item.id]['quantity']
                  : item.quantity || quantChange) * item.price
              ).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return dateData != null ? (
    <View style={{ flex: 1, flexDirection: 'column' }}>
      <View style={{ flex: 8, flexDirection: 'row' }}>
        <View style={{ flex: 1 }}></View>
        <View style={{ flex: 15, marginBottom: 20 }}>
          <FlatList
            ItemSeparatorComponent={<View style={styles.itemSeparator}></View>}
            data={dateData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
        <View style={{ flex: 1 }}></View>
      </View>
      {overallState ? (
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontWeight: 'bold',
                alignContent: 'center',
                justifyContent: 'center',
                alignSelf: 'flex-end',
                fontSize: 18,
              }}
            >
              Save
            </Text>
          </View>
          <View
            style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start' }}
          >
            <Pressable
              onPress={() => {
                saveTheStateToDB();
              }}
            >
              <View style={{ paddingRight: 20, paddingTop: 10 }}>
                <Icon name='save' size={30} />
              </View>
            </Pressable>
          </View>
        </View>
      ) : (
        <View></View>
      )}
    </View>
  ) : (
    <View style={{ alignItems: 'center' }}>
      <Image
        source={require('../../assets/noOrders.png')}
        style={styles.imageView}
      />
      <Text>No orders scheduled!!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  itemsMainContainer: {
    elevation: 1,
    backfaceVisibility: 'visible',
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: { width: -2, height: 5 },
    shadowOpacity: 4,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  headerContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,
  },
  headerText: {
    flex: 1,
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    paddingLeft: 10,
  },
  description: {
    flex: 1,
    color: 'black',
    fontWeight: 'normal',
    paddingLeft: 10,
  },
  imageView: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  itemSeparator: {
    backgroundColor: 'grey',
    height: 2,
    alignItems: 'flex-start',
    margin: 6,
  },
});

export default SubscriptionList;
