import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/styles';

const PaymentScreen = ({route}) => {

    const { userDetails } = route.params;
    console.log("userdetails in payments= ",userDetails);

  // Replace these with the actual card details of the user
  const cardNumber = '**** **** **** 5431';
  const cardHolderName = userDetails[0].firstname + " " + userDetails[0].lastname;
  const expirationDate = '12/28';
  const cvv = '***';

  return (
    <View style={styles.container}>
         <View style={styles.textContainer}>
        <Text style={styles.updateText}> Card Details </Text>
      </View>
      <View style={styles.cardContainer}>
        <Text style={styles.cardNumber}>{cardNumber}</Text>
        <Text style={styles.cardHolder}>{cardHolderName}</Text>
        <View style={styles.bottomContainer}>
          <Text style={styles.expiry}>{expirationDate}</Text>
          <Text style={styles.cvv}>{cvv}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  cardContainer: {
    width: 320,
    height: 200,
    backgroundColor: Colors.primary100,
    borderRadius: 20,
    elevation: 3,
    padding: 20,
    marginTop: 20,
    justifyContent: 'space-between',
  },
  cardNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardHolder: {
    fontSize: 18,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  expiry: {
    fontSize: 18,
  },
  cvv: {
    fontSize: 18,
  },
  textContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginTop: 10
  },
  updateText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PaymentScreen;
