import React, { useState, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/styles';
import Icon from 'react-native-vector-icons/Feather';

function LeftRight({ slotValue, uniqueId, parentUpdateFunc, movement }) {
  let [newSlotValue, setNewSlotValue] = useState(slotValue);

  useEffect(() => {
    parentUpdateFunc(uniqueId, newSlotValue);
  }, [newSlotValue]);

  function decrement() {
    console.log('Pressed decrement');
    movement.forEach((value, index) => {
      console.log(
        '-->',
        value.length,
        newSlotValue.length,
        '-' + value + '-',
        '-' + newSlotValue + '-'
      );
      if (newSlotValue.includes(value)) {
        console.log(`Value found: ${value}`);
        if (index === 0) {
          console.log('Index is 0');
          return;
        } else {
          setNewSlotValue(movement[index - 1]);
          return;
        }
      } else {
        console.log('No match found');
      }
    });
  }

  function increment() {
    movement.forEach((value, index) => {
      if (newSlotValue.includes(value)) {
        if (index === movement.length - 1) {
          return;
        } else {
          setNewSlotValue(movement[index + 1]);
          return;
        }
      }
    });
  }
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}
    >
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        onPress={decrement}
      >
        <Icon name='chevron-left' size={18} />
      </Pressable>
      <Text style={styles.buttonText}>{newSlotValue}</Text>
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        onPress={increment}
      >
        <Icon name='chevron-right' size={18} />
      </Pressable>
    </View>
  );
}

export default LeftRight;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 2,
    paddingHorizontal: 2,
    margin: 2,
  },
  pressed: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'black',
    fontSize: 15,
  },
});
