import { useState, useEffect, useContext } from 'react';
import { Text, View, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../store/auth-context';

export default function PastordersScreen() {
  const authCtx = useContext(AuthContext);
  const [userId, setUserId] = useState(authCtx.localId);

  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      console.log('Fetching data...');
      const url =
        'http://dev-lb-subscribite-234585004.us-west-2.elb.amazonaws.com/subscriptions/past_orders'; // Replace with your API endpoint URL
      const finalData = [];

      try {
        const response = await axios.post(url, { user_id: userId });
        // setData(response.data); // Assuming the API response is an array of items
        const res = response.data;
        // console.log(res);
        // console.log(JSON.stringify(response.data));
        for (const date in res) {
          // for every date, get the associated items
          const items = res[date];
          // console.log(items);
          // for every item in the array, add a newItem object to finalData
          items.forEach((item) => {
            const newItem = {
              id: item.id,
              date: item.delivery_date,
              timeslot: item.time_slot_id,
              timeslot_description: item.time_slot_description,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              price: item.price,
            };
            finalData.push(newItem);
          });
        }
        setData([...finalData]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      // console.log(finalData[0]);

      // finalData is now an array of indidivudal delivery items, transform it to the desired map
      const result = [];

      finalData.forEach((item) => {
        const { date, timeslot, timeslot_description, price } = item;
        const dateOnly = new Date(date).toISOString().split('T')[0]; // Extracting only the date part
        const key = `${dateOnly}__${timeslot}`;
        const existingEntry = result.find((entry) => entry.key === key);

        if (existingEntry) {
          existingEntry.items.push(item);
          existingEntry.totalCost += price;
        } else {
          let newEntry = {
            key: key,
            dateOnly: dateOnly,
            timeslot: timeslot_description,
            items: [item],
            totalCost: price,
          };
          result.push(newEntry);
        }
      });

      // console.log(result);

      setData([...result]);
    };
    fetchData();
  }, []);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.section}>
          <Text style={styles.keyText}>{item.dateOnly}</Text>
          <Text style={styles.keyText1}>{item.timeslot}</Text>
        </View>
        <View style={styles.section}>
          <FlatList
            data={item.items}
            keyExtractor={(subItem, index) => index.toString()}
            renderItem={({ item: subItem }) => (
              <View style={styles.row}>
                <Text style={styles.cell}>
                  {subItem.name} | {subItem.quantity} pc
                </Text>
              </View>
            )}
          />
        </View>
        <View style={[styles.section, styles.cost]}>
          <Text style={styles.totalCostText}>${item.totalCost}</Text>
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        //marginTop: '25%',
      }}
    >
      <View style={styles.listArea}>
        <FlatList
          data={data}
          keyExtractor={(item, index) => `${item.key}_${index}`}
          renderItem={renderItem}
          contentContainerStyle={styles.flatListContent}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'lightgray',
  },
  section: {
    flex: 1,
    //marginLeft: 2,
    flexGrow: 1,
    // borderColor: 'red',
    // borderWidth: 2,
  },
  keyText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  keyText1: {
    fontSize: 13.5,
    //fontWeight: 'bold',
  },
  subItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  totalCostText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  itemText: {
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'lightgray',
  },
  cell: {
    flex: 1,
  },
  cost: {
    maxWidth: '20%',
    marginRight: 5,
    paddingHorizontal: 0,
  },
  flatListContent: {
    flexGrow: 1,
  },
  listArea: {
    maxHeight: '100%',
  },
  formArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputField: {
    borderWidth: 1,
    borderColor: 'black',
  },
});
