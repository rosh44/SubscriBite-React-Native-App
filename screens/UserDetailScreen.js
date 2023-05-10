import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../store/auth-context';
import { useNavigation } from '@react-navigation/native';
function UserDetailScreen() {
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [apartmentNumber, setApartmentNumber] = useState('');

  const [zipCode, setZipCode] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  async function handleSubmit() {
    setIsLoading(true);
    setIsSuccess(false);
    setIsError(false);

    try {
      const response = await axios.post(
        'http://dev-lb-subscribite-234585004.us-west-2.elb.amazonaws.com/register',
        {
          firstname: firstName,
          lastname: lastName,
          phone_number: phoneNumber,
        },
        {
          headers: {
            //Authorization: `<YOUR_ACCESS_KEY>`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Status:', response.status);
      setIsSuccess(true);
      //after success, I want to store the name of the user in the React Store and also set the user as a registered user
      authCtx.setUserDetails(firstName);
      authCtx.setRegisteredUser(true);
      //then I want to have a 1.5 second timeout before navigating to the Home page
      setTimeout(() => {
        navigation.replace('HomeScreenStack');
      }, 1500);
    } catch (error) {
      console.error('Error:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.form}>
      <TextInput
        style={styles.input}
        placeholder='First Name'
        onChangeText={setFirstName}
        value={firstName}
      />
      <TextInput
        style={styles.input}
        placeholder='Last Name'
        onChangeText={setLastName}
        value={lastName}
      />
      <TextInput
        style={styles.input}
        placeholder='Phone Number'
        onChangeText={setPhoneNumber}
        value={phoneNumber}
      />
      <TextInput
        style={styles.input}
        placeholder='Street Address'
        onChangeText={setStreetAddress}
        value={streetAddress}
      />
      <TextInput
        style={styles.input}
        placeholder='Apt No'
        onChangeText={setApartmentNumber}
        value={apartmentNumber}
      />
      <TextInput
        keyboardType='numeric'
        style={styles.input}
        placeholder='Zip Code'
        onChangeText={setZipCode}
        value={zipCode}
      />
      <Button title='Submit' onPress={handleSubmit} />
      {isLoading && <Text>Loading...</Text>}
      {isSuccess && <Text style={{ color: 'green' }}>Success!</Text>}
      {isError && <Text style={{ color: 'red' }}>Error!</Text>}
    </View>
  );
}

export default UserDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});
