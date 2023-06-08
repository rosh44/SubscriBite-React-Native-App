import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
  Keyboard,
} from 'react-native';
import { useState, useRef } from 'react';
import { Colors } from '../constants/styles';

import TimeSlotPicker from './TimeSlotPicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { BlurView } from 'expo-blur';

function AddSubsModal({
  modalVisible,
  closeModal,
  incrementQuantity,
  decrementQuantity,
  quantity,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  frequency,
  setFrequency,
  timeslot,
  setTimeslot,
  selectedItem,
  handleConfirm,
  handleUnSubscribe,
  tomorrowDate,
  endDate,
}) {
  // console.log("TOmm date",tomorrowDate);
  //console.log("from date",new Date(fromDate).getUTCDate() )
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDateField, setSelectedDateField] = useState(null);
  const [firstDate, setFirstDate] = useState(tomorrowDate);
  const [secondDate, setSecondDate] = useState(endDate);
  const inputFrequencyRef = useRef(null);

  const setFormattedDates = (inpDate) => {
    const date = new Date(inpDate);

    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const monthIndex = date.getUTCMonth();
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();

    const formattedDate = `${months[monthIndex]} ${day}, ${year}`;

    // console.log(formattedDate);
    return formattedDate;
  };

  const showDatePicker = (dateField) => {
    // console.log('Pressed');
    if (dateField === 'fromDate') {
      setSelectedDateField('fromDate');
    } else {
      setSelectedDateField('toDate');
    }
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
    // console.log('Hid date picker');
  };

  const handleConfirmDate = (date) => {
    if (selectedDateField === 'fromDate') {
      setFromDate(date.toISOString().slice(0, 10));
      setFirstDate(date);
      setSecondDate(date); // change to max of both dates
    } else {
      setToDate(date.toISOString().slice(0, 10));
      setSecondDate(date);
    }
    // console.log(fromDate, toDate);
    hideDatePicker();
  };

  const handleFrequencyDone = () => {
    Keyboard.dismiss();
  };

  const totalCost = selectedItem ? selectedItem.price * quantity : 0;
  return (
    <>
      {modalVisible && (
        <BlurView intensity={100} tint='dark' style={StyleSheet.absoluteFill} />
      )}
      <Modal visible={modalVisible} transparent={true} animationType='slide'>
        <View style={styles.modalContent}>
          <View style={styles.quantityContainer}>
            <Text style={styles.inputLabel}>Quantity:</Text>
            <View style={styles.quantityButtonsContainer}>
              <TouchableOpacity
                onPress={decrementQuantity}
                style={styles.quantityButton}
              >
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{quantity}</Text>
              <TouchableOpacity
                onPress={incrementQuantity}
                style={styles.quantityButton}
              >
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>From:</Text>
            <TouchableWithoutFeedback
              onPress={() => showDatePicker('fromDate')}
            >
              <View>
                <TextInput
                  style={styles.textInput}
                  value={setFormattedDates(fromDate)}
                  editable={false}
                />
              </View>
            </TouchableWithoutFeedback>

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              minimumDate={
                selectedDateField === 'fromDate' ? tomorrowDate : firstDate
              }
              mode='date'
              onConfirm={handleConfirmDate}
              onCancel={hideDatePicker}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>To:</Text>

            <TouchableWithoutFeedback onPress={() => showDatePicker('toDate')}>
              <View>
                <TextInput
                  style={styles.textInput}
                  value={setFormattedDates(toDate)}
                  editable={false}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Frequency (days):</Text>
            <TouchableWithoutFeedback
              onPress={handleFrequencyDone}
              keyboardShouldPersistTaps='handled'
            >
              <TextInput
                ref={inputFrequencyRef}
                style={styles.textInput}
                value={frequency}
                onChangeText={setFrequency}
                keyboardType='numeric'
              ></TextInput>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Timeslot: </Text>
            <TimeSlotPicker timeslot={timeslot} setTimeslot={setTimeslot} />
          </View>

          <View style={styles.buttonContainer}>
            <View style={styles.confirmContainer}>
              <Text style={styles.confirmCostText}>
                Total Cost: ${totalCost.toFixed(2)}
              </Text>
              <TouchableOpacity
                onPress={handleConfirm}
                style={styles.confirmButton}
              >
                <Text style={styles.confirmButtonText}>Confirm?</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer1}>
              <TouchableOpacity
                onPress={handleUnSubscribe}
                style={styles.unSubscribeButton}
              >
                <Text style={styles.confirmButtonText}>Unsubscribe?</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.confirmButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

export default AddSubsModal;

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    backgroundColor: Colors.primary100,
    padding: 16,
    marginTop: '75%',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  quantityButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    minWidth: '50%',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: Colors.primary800,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 160,
  },
  unSubscribeButton: {
    backgroundColor: '#F05254',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 160,
    marginTop: 20,
    marginRight: 20,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  closeButton: {
    backgroundColor: Colors.error800,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 160,
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  confirmContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  confirmCostText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary800, // Blue color (you can adjust the color to your preference)
    margin: 10,
    paddingRight: 20,
  },
  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  buttonContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 0,
  },
});
