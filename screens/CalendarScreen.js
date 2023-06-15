import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Text } from 'react-native';
import { ExpandableCalendar, CalendarProvider } from 'react-native-calendars';
import { AuthContext } from '../store/auth-context';
import { useContext } from 'react';
import { CartContext } from '../store/cart-context';

import SubscriptionList from '../components/Orders/SubscriptionList';

function CalendarScreen({ route }) {
  const cartCtx = useContext(CartContext);

  const refreshItem = cartCtx.refreshItem;
  // console.log(`RefreshItem: ${refreshItem}`);
  const { userId, api } = route.params;
  const authCtx = useContext(AuthContext);

  const name = authCtx.name;

  let [userData, setUserData] = useState({});
  let [dateData, setDateData] = useState([]);
  let [dataRefreshed, setdataRefreshed] = useState(0);
  let [markedDates, setMarkedDates] = useState({});
  let [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().substring(0, 10)
  );

  const onDateChanged = (date) => {
    const prevDate = selectedDate;
    const newDate = date.dateString;
    setMarkedDates(() => {
      let newMarkedDates = { ...markedDates };
      if (newMarkedDates[prevDate]) {
        newMarkedDates[prevDate] = {
          ...newMarkedDates[prevDate],
          selected: false,
        };
      }

      if (newMarkedDates[newDate]) {
        newMarkedDates[newDate] = {
          ...newMarkedDates[newDate],
          selected: true,
        };
      }
      return newMarkedDates;
    });
    setSelectedDate(newDate);
    setDateData(userData[newDate]);
  };

  useEffect(() => {
    const url = api + '/subscriptions/upcoming_orders';
    console.log(`Calendar UID: ${userId}`);
    const data = { user_id: userId };
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        setUserData(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [dataRefreshed, refreshItem]);

  useEffect(() => {
    const todaysDate = new Date().toISOString().substring(0, 10);
    const key = selectedDate || todaysDate;
    // Initialize the marked Dates
    setMarkedDates(() => {
      const markedDates = {};
      for (let key in userData) {
        markedDates[key] = { marked: true, selected: false };
      }
      if (markedDates[key]) {
        markedDates[key]['selected'] = true;
      }
      return markedDates;
    });
    setDateData(userData[key]);
  }, [userData]);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.calendarContainer}>
    
        <CalendarProvider
          date={selectedDate}
          disabledOpacity={0.6}
          todayOpacity={1.0}
        >
          <ExpandableCalendar
            hideKnob={true}
            onDayPress={onDateChanged}
            dayTextColor={'black'}
            minDate={new Date().toISOString().substring(0, 10)}
            maxDate={new Date(Date.now() + 5 * 86400000)
              .toISOString()
              .substring(0, 10)}
            disableAllTouchEventsForDisabledDays={true}
            markedDates={markedDates}
          />
        </CalendarProvider>
      </View>
      <View style={styles.container}>
        <Text style={styles.updateText}>
          {' '}
          The changes made on this page will only update the subscription for a particular day
          {' '}
        </Text>
      </View>
      <View style={styles.listContainer}>
        <SubscriptionList
          dateData={dateData}
          api={api}
          parentFunction={() => {
            setdataRefreshed(() => dataRefreshed + 1);
          }}
        />
      </View>
    </View>
  );
}

export default CalendarScreen;

const styles = StyleSheet.create({
  calendarContainer: { flexDirection: 'column', flex: 2 },
  listContainer: { flex: 8 },
  mainContainer: { flex: 1 },
  updateText: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 7
  },
});
