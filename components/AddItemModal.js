import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Colors } from '../constants/styles';

import TimeSlotPicker from './TimeSlotPicker';
import { BlurView } from 'expo-blur';

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

            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.confirmButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

export default AddItemModal;

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
    minWidth: '40%',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: Colors.primary800,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 160,
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
    marginTop: 30,
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
  },
  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
