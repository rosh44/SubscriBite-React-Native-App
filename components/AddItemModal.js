import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
  BackHandler,
} from 'react-native';
import { Colors } from '../constants/styles';

import TimeSlotPicker from './TimeSlotPicker';

function AddItemModal({
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
}) {
  const totalCost = selectedItem ? selectedItem.price * quantity : 0;
  return (
    <Modal visible={modalVisible} transparent={true} animationType='slide'>
      <View style={styles.modalContent}>
        <View style={styles.quantityContainer}>
          <Text style={styles.inputLabel}>Quantity:</Text>

          <TouchableOpacity
            onPress={decrementQuantity}
            style={styles.quantityButton}
          >
            <Text>-</Text>
          </TouchableOpacity>
          <Text>{quantity}</Text>
          <TouchableOpacity
            onPress={incrementQuantity}
            style={styles.quantityButton}
          >
            <Text>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>From:</Text>
          <TextInput
            style={styles.textInput}
            value={fromDate}
            onChangeText={setFromDate}
          ></TextInput>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>To:</Text>
          <TextInput
            style={styles.textInput}
            value={toDate}
            onChangeText={setToDate}
          ></TextInput>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Frequency (days):</Text>
          <TextInput
            style={styles.textInput}
            value={frequency}
            onChangeText={setFrequency}
            keyboardType='numeric'
          ></TextInput>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Timeslot: </Text>
          <TimeSlotPicker timeslot={timeslot} setTimeslot={setTimeslot} />
        </View>
        <Text style={styles.inputLabel}>
          Total Cost: ${totalCost.toFixed(2)}
        </Text>
        <View style={styles.inputContainer}>
          <TouchableOpacity
            onPress={handleConfirm}
            style={styles.confirmButton}
          >
            <Text style={styles.confirmButtonText}>Confirm?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
            <Text style={styles.confirmButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default AddItemModal;

const styles = StyleSheet.create({
  modalContent: {
    // backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    // alignItems: 'center',
    height: '40%',
    backgroundColor: Colors.primary100,
    borderWidth: 5,
    // marginTop: '35%',
    // marginBottom: '35%',
    padding: 20,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 20,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#DDDDDD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
  },

  closeButtonText: {
    fontSize: 18,
    color: 'gray',
  },
  inputLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
  },
  confirmButton: {
    backgroundColor: 'blue',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    margin: 10,
  },
  closeButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    margin: 10,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
  },
  buttonRow: {
    flex: 1,
    alignItems: 'space-around',
    justifyContent: 'center',
    flexDirection: 'row',
    borderColor: 'red',
    borderRadius: 8,
  },
  // inputContainer: {
  //   flex: 1,
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  //   alignItems: 'space-around',
  // },
});
