import React, { useState, useContext, useRef, useEffect } from 'react';
import {
  Alert,
  View,
  StyleSheet,
  Text,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../store/auth-context';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/ui/Button';
import Input from '../components/Auth/Input';
import { Colors } from '../constants/styles';
import PhoneInput from 'react-native-phone-input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

function UserDetailScreen({ route }) {
  const { userDetails } = route.params;
  console.log('userdetails', userDetails);

  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();
  const phoneInputRef = useRef(null);

  useEffect(() => {
    async function fetchRegistered() {
      let localId = await AsyncStorage.getItem('localId');
      console.log(localId);
    }
    fetchRegistered();
    if (userDetails) {
      phoneInputRef.current.setValue(userDetails[0].phone_number);
    }
  }, [userDetails]);

  var streetAddr = '';
  var aptNo = '';
  var zip = '';
  var cityName = '';

  if(!(userDetails[0].address == null)){
    const splitAddr = userDetails[0].address.split(',');
    console.log(splitAddr);
    streetAddr = splitAddr[1];
    aptNo = splitAddr[0];
    cityName = splitAddr[2];
    zip = splitAddr[3];
  }

  const [firstName, setFirstName] = useState(userDetails[0].firstname);
  const [lastName, setLastName] = useState(userDetails[0].lastname);
  const [streetAddress, setStreetAddress] = useState(streetAddr);
  const [apartmentNumber, setApartmentNumber] = useState(aptNo);

  const [zipCode, setZipCode] = useState(zip);
  const [city, setCity] = useState(cityName);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const [fNameIsInvalid, setFNameInvalid] = useState(false);
  const [lNameIsInvalid, setLNameInvalid] = useState(false);
  const [streetAddrIsInvalid, setStreetAddrInvalid] = useState(false);
  const [aptNoIsInvalid, setAptNoInvalid] = useState(false);
  const [cityIsInvalid, setCityInvalid] = useState(false);
  const [phnNoIsInvalid, setPhnNoInvalid] = useState(false);
  const [zipCodeIsInvalid, setZipCodeInvalid] = useState(false);

  function validate() {

    // const phoneNumber = phoneInputRef.current.getValue().trim();
    // const zipCodeTrimmed = zipCode.trim();
    // const fNameTrimmed = firstName.trim();
    // const lNameTrimmed = lastName.trim();
    // const streetAddrTrimmed = streetAddress.trim();
    // const aptNoTrimmed = apartmentNumber.trim();
    // const cityTrimmed = city.trim();

    const phoneNumber = phoneInputRef.current?.getValue()?.trim() || '';
    const zipCodeTrimmed = zipCode?.trim() || '';
    const fNameTrimmed = firstName?.trim() || '';
    const lNameTrimmed = lastName?.trim() || '';
    const streetAddrTrimmed = streetAddress?.trim() || '';
    const aptNoTrimmed = apartmentNumber?.trim() || '';
    const cityTrimmed = city?.trim() || '';

    const phnNoIsValid = /^\+?[0-9]{10,13}$/.test(phoneNumber);
    const zipCodeIsValid = zipCodeTrimmed.match(/^[0-9]+$/);
    const fNameIsValid =
      fNameTrimmed.length != 0 && fNameTrimmed.match(/^[A-Za-z0-9\s]+$/);
    const lNameIsValid =
      lNameTrimmed.length != 0 && lNameTrimmed.match(/^[A-Za-z0-9\s]+$/);
    const streetAddrIsValid =
      streetAddrTrimmed.length != 0 &&
      streetAddrTrimmed.match(/^[A-Za-z0-9\s]+$/);
    const aptNoIsValid =
      aptNoTrimmed.length != 0 && aptNoTrimmed.match(/^[A-Za-z0-9\s]+$/);
    const cityIsValid =
      cityTrimmed.length != 0 && cityTrimmed.match(/^[A-Za-z0-9\s]+$/);

    setFNameInvalid(!fNameIsValid);

    if (!fNameIsValid) {
      Alert.alert(
        'Invalid Input',
        'Enter First Name with no special characters'
      );
      return false;
    }

    setLNameInvalid(!lNameIsValid);

    if (!lNameIsValid) {
      Alert.alert(
        'Invalid Input',
        'Enter Last Name with no special characters'
      );
      return false;
    }

    setPhnNoInvalid(!phnNoIsValid);

    if (!phnNoIsValid) {
      Alert.alert('Error', 'Invalid Phone Number');
      return false;
    }

    setStreetAddrInvalid(!streetAddrIsValid);

    if (!streetAddrIsValid) {
      Alert.alert(
        'Invalid Input',
        'Enter Street Address with no special characters'
      );
      return false;
    }

    setAptNoInvalid(!aptNoIsValid);

    if (!aptNoIsValid) {
      Alert.alert(
        'Invalid Input',
        'Enter Apartment No. with no special characters'
      );
      return false;
    }

    setCityInvalid(!cityIsValid);

    if (!cityIsValid) {
      Alert.alert('Invalid Input', 'Enter City with no special characters');
      return false;
    }

    setZipCodeInvalid(!zipCodeIsValid);

    if (!zipCodeIsValid) {
      Alert.alert('Error', 'Zip Code must be numeric');
      return false;
    }

    return true;
  }
  async function updateUser() {
    console.log('in update user');
    setIsLoading(true);
    setIsSuccess(false);
    setIsError(false);
    try {
      const formattedPhoneNumber = phoneInputRef.current.getValue();

      console.log('PHONE NUMBER=', formattedPhoneNumber);
      const response = await axios.post(
        'http://dev-lb-subscribite-234585004.us-west-2.elb.amazonaws.com/users/updateInfo',
        {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone_number: formattedPhoneNumber.trim(),
          user_id: authCtx.localId,
          address:
            apartmentNumber.trim() +
            ', ' +
            streetAddress.trim() +
            ', ' +
            city.trim() +
            ', ' +
            zipCode.trim(),
        }
      );
      console.log('Status:', response.data);
      setIsSuccess(true);
      Alert.alert('Success', 'Profile updated!');
      navigation.replace('Account1');
    } catch (error) {
      console.error('Error:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit() {
    // this is the first time screen that comes up
    const isValid = validate();

    if (isValid) {
      console.log('id=', userDetails[0].id);
      if (!(userDetails[0].id == '')) {
        updateUser();
      } else {
        console.log('in insert user');
        setIsLoading(true);
        setIsSuccess(false);
        setIsError(false);

        try {
          const formattedPhoneNumber = phoneInputRef.current.getValue();

          console.log('PHONE NUMBER=', formattedPhoneNumber);

          const response = await axios.post(
            'http://dev-lb-subscribite-234585004.us-west-2.elb.amazonaws.com/users/updateInfo',
            {
              first_name: firstName.trim(),
              last_name: lastName.trim(),
              phone_number: formattedPhoneNumber.trim(),
              user_id: authCtx.localId,
              address:
                apartmentNumber +
                ', ' +
                streetAddress +
                ', ' +
                city +
                ', ' +
                zipCode,
            }
          );
          console.log('Status:', response.data);

          //after success, I want to store the name of the user in the React Store and also set the user as a registered user
          authCtx.setUserDetails(firstName);
          console.log('Setting user as registered');
          authCtx.setRegisteredUser(true);
          //then I want to have a 1.5 second timeout before navigating to the Home page
          setTimeout(() => {
            navigation.replace('HomeScreenStack');
          }, 1500);
          setIsSuccess(true);
        } catch (error) {
          console.error('Error:', error);
          setIsError(true);
        } finally {
          setIsLoading(false);
        }
      }
    }

    console.log('In user detail screen');
  }

  const handleLayout = () => {
    // fetchItems ? null : setFilteredItems(itemsList);
    // SplashScreen.hideAsync();
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.authContent} onLayout={handleLayout}>
          <View style={styles.form}>
            <View>
              <Input
                label='First Name'
                onUpdateValue={setFirstName}
                value={firstName}
                isInvalid={fNameIsInvalid}
              />
              <Input
                label='Last Name'
                onUpdateValue={setLastName}
                value={lastName}
                isInvalid={lNameIsInvalid}
              />
              <View style={styles.inputContainer}>
                <Text
                  style={[styles.label, phnNoIsInvalid && styles.labelInvalid]}
                >
                  Phone No.
                </Text>
                <PhoneInput
                  style={[
                    styles.phoneInput,
                    phnNoIsInvalid && styles.inputInvalid,
                  ]}
                  ref={phoneInputRef}
                  initialCountry='us'
                  withShadow
                  autoFocus
                />
              </View>
              <Input
                label='Street Address'
                onUpdateValue={setStreetAddress}
                value={streetAddress}
                isInvalid={streetAddrIsInvalid}
              />
              <Input
                label='Apartment No.'
                onUpdateValue={setApartmentNumber}
                value={apartmentNumber}
                isInvalid={aptNoIsInvalid}
              />
              <Input
                label='City'
                onUpdateValue={setCity}
                value={city}
                isInvalid={cityIsInvalid}
              />
              <Input
                keyboardType='numeric'
                label='Zip Code'
                onUpdateValue={setZipCode}
                value={zipCode}
                isInvalid={zipCodeIsInvalid}
              />
              <View style={styles.buttons}>
                <Button onPress={handleSubmit}>{'Submit'}</Button>
              </View>
              {isLoading && <Text>Loading...</Text>}
              {isSuccess && <Text style={{ color: 'green' }}>Success!</Text>}
              {isError && <Text style={{ color: 'red' }}>Error!</Text>}
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
export default UserDetailScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 250,
  },
  inputContainer: {
    marginVertical: 8,
  },
  label: {
    color: 'white',
    marginBottom: 4,
  },
  phoneInput: {
    paddingVertical: 12,
    paddingHorizontal: 6,
    backgroundColor: Colors.primary100,
    borderRadius: 4,
  },
  authContent: {
    marginTop: 25,
    marginHorizontal: 32,
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary800,
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  buttons: {
    marginTop: 12,
  },
  labelInvalid: {
    color: Colors.error500,
  },
  inputInvalid: {
    backgroundColor: Colors.error100,
  },
});
