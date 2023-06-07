import React, { useState, useEffect } from 'react';
import { Alert,View, StyleSheet, Text,ScrollView, KeyboardAvoidingView } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/ui/Button';
import Input from '../components/Auth/Input';
import { Colors } from '../constants/styles';
import { Picker } from '@react-native-picker/picker';

function SuggestProductScreen() {
  const navigation = useNavigation();

  const [categories, setCategories] = useState([]);

  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [reason, setReason] = useState('');
  const [frequency, setFrequency] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const [prodNameIsInvalid, setProdNameInvalid] = useState(false);
  const [categoryIsInvalid, setCategoryInvalid] = useState(false);
  const [descIsInvalid, setDescInvalid] = useState(false);
  const [reasonIsInvalid, setReasonInvalid] = useState(false);
  const [freqIsInvalid, setFreqInvalid] = useState(false);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.post('http://dev-lb-subscribite-234585004.us-west-2.elb.amazonaws.com/categories');
        const categoriesData = response.data; 
        setCategories(categoriesData);
        console.log(categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
  
    fetchCategories();
  }, []);

  function validate(){
    
    console.log("category=",category);
    console.log("freq=",frequency);
    const pNameIsValid = (productName.trim()).length != 0;
    const categoryIsValid = (category.trim()).length != 0;
    const descIsValid = (description.trim()).length != 0;
    const reasonIsValid = (reason.trim()).length != 0;
    const freqIsValid = (frequency.trim()).length != 0;

    setProdNameInvalid(!pNameIsValid);

    if (!pNameIsValid) {
      Alert.alert('Invalid Input', 'Enter Product Name');
      return false;
    }

    setCategoryInvalid(!categoryIsValid);

    if (!categoryIsValid) {
      Alert.alert('Invalid Input', 'Select a Category');
      return false;
    }

    setDescInvalid(!descIsValid);

    if (!descIsValid) {
      Alert.alert('Invalid Input', 'Enter Description');
      return false;
    }

    setReasonInvalid(!reasonIsValid);

    if (!reasonIsValid) {
      Alert.alert('Invalid Input', 'Enter a reason for suggestion');
      return false;
    }

    setFreqInvalid(!freqIsValid);

    if (!freqIsValid) {
      Alert.alert('Invalid Input', 'Select Product Usage Frequency');
      return false;
    }

    return true;
  }

  async function handleSubmit() {

    const isValid = validate();
    //const isValid = true;
    if (isValid){
  
      setIsLoading(true);
      setIsSuccess(false);
      setIsError(false);

      try {

        // const response = await axios.post(
        //   'http://dev-lb-subscribite-234585004.us-west-2.elb.amazonaws.com/register',
        //   {
        //     firstname: firstName.trim(),
        //     lastname: lastName.trim(),
        //     phone_number: formattedPhoneNumber.trim(),
        //   },
        //   {
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //   }
        // );
        // console.log('Status:', response.status);
        setIsSuccess(true);
        Alert.alert(
          'Success',
          'Thank you for your product suggestion! We appreciate your input and will review it carefully. If it meets our criteria and aligns with our offerings, we will take it into consideration for future additions to our catalog.'
          ,
          [
            { text: 'OK', onPress: () => navigation.replace('Account1') }
          ]
        );
      } catch (error) {
        console.error('Error:', error);
        setIsError(true);
        Alert.alert(
          'Error',
          'We apologize for the inconvenience. It seems that there was an issue while processing your suggestion. Please try again later.'
        );
        setIsError(false);
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
    <ScrollView contentContainerStyle={styles.scrollContainer}>
    <View style={styles.authContent}>
    <View style={styles.form}>
      <View>
        <Input
          label='Product Name'
          onUpdateValue={setProductName}
          value={productName}
          isInvalid={prodNameIsInvalid}
        />
         <View style={styles.inputContainer}>
          <Text style={styles.label}>Product Category</Text>
        <Picker style={styles.picker}
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
        >
          <Picker.Item key='Select' label='Select Category' value='Select'/>
          {categories.map((category) => (
            <Picker.Item key={category} label={category} value={category} />
          ))}
          <Picker.Item key='Other' label='Other' value='Other'/>
        </Picker>
        </View>
        <Input
          label='Description'
          multiline = {true}
          numberOfLines={3}
          textAlignVertical="top"
          onUpdateValue={setDescription}
          value={description}
          placeholder= 'Brand, size, flavor, etc.'
        />
        <Input
          label='Reason for Suggestion'
          multiline = {true}
          numberOfLines={3}
          textAlignVertical="top"
          onUpdateValue={setReason}
          value={reason}
          isInvalid={reasonIsInvalid}
        />
         <View style={styles.inputContainer}>
          <Text style={styles.label}>Product Usage Frequency</Text>
        <Picker style={styles.picker}
          selectedValue={frequency}
          onValueChange={(itemValue) => setFrequency(itemValue)}
        >
          <Picker.Item key='Select' label='Select Frequency' value='Select'/>
          <Picker.Item label="Daily" value="daily" />
          <Picker.Item label="Weekly" value="weekly" />
          <Picker.Item label="Monthly" value="monthly" />
          <Picker.Item label="Occasionally" value="occasionally" />
        </Picker>
        </View>
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

export default SuggestProductScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  inputContainer: {
    marginVertical: 8,
  },
  label: {
    color: 'white',
    marginBottom: 4
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
  buttons: {
    marginTop: 12
  },
  labelInvalid: {
    color: Colors.error500,
  },
  inputInvalid: {
    backgroundColor: Colors.error100,
  },
  picker: {
    backgroundColor: Colors.primary100, 
  },
});
