import { Picker } from '@react-native-picker/picker';
import { StyleSheet, View } from 'react-native';

function TimeSlotPicker({ timeslot, setTimeslot }) {
  return (
    <View style={styles.pickerContainer}>
      <Picker
        style={styles.picker}
        selectedValue={timeslot}
        onValueChange={setTimeslot}
      >
        <Picker.Item label='Morning (6 AM - 8 AM)' value={1}></Picker.Item>
        <Picker.Item label='Noon (11 AM - 1 PM)' value={2}></Picker.Item>
        <Picker.Item label='Evening (4 PM - 6 PM)' value={3}></Picker.Item>
        <Picker.Item label='Night (9 PM - 11 PM)' value={4}></Picker.Item>
      </Picker>
    </View>
  );
}

export default TimeSlotPicker;

const styles = StyleSheet.create({
  pickerContainer: {
    minWidth: '50%',
    maxHeight: 50,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  picker: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
