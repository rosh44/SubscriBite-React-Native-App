import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
} from 'react-native';

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
    <Modal visible={modalVisible} animationType='fade'>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <Text>Quantity:</Text>
          <View style={styles.quantityContainer}>
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
            <Text style={styles.inputLabel}>Timeslot</Text>
            <TimeSlotPicker timeslot={timeslot} setTimeslot={setTimeslot} />
          </View>
          <Text style={styles.inputLabel}>
            Total Cost: ${totalCost.toFixed(2)}
          </Text>
          <TouchableOpacity
            onPress={handleConfirm}
            style={styles.confirmButton}
          >
            <Text style={styles.confirmButtonText}>Confirm?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default AddItemModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    top: '20%',
    bottom: '20%',
    left: '20%',
    right: '20%',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
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
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
